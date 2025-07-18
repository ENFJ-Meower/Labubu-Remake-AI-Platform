from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import httpx
import aioboto3
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, Dict, Any
from google import genai
from google.genai import types
from tempfile import NamedTemporaryFile

app = FastAPI(title="AI Agent Microservice API", description="Speech-to-Text API")

class Audio2TextRequest(BaseModel):
    input_url: str
    edge_url: Dict[str, Dict[str, str]]
    target_url: str

class Audio2TextResponse(BaseModel):
    success: bool
    message: str
    s3_url: Optional[str] = None

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

executor = ThreadPoolExecutor(max_workers=8)

async def download_audio_async(url: str) -> bytes:
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.content

async def download_audio_if_audio(url: str) -> Optional[bytes]:
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "").lower()
            if content_type.startswith("audio/"):
                return resp.content
            return None
    except Exception:
        return None

def gemini_audio_to_text(audio_bytes: bytes, mime_type: str = "audio/wav") -> str:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY environment variable is not set.")
    client = genai.Client(api_key=GOOGLE_API_KEY)
    with NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        tmp.write(audio_bytes)
        tmp.flush()
        myfile = client.files.upload(file=tmp.name)
        prompt = "Generate a transcript of the speech, all Chinese should be simplified Chinese."
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, myfile]
        )
        return response.text

async def upload_text_to_s3_async(text: str, s3_url: str) -> str:
    if not s3_url.startswith("s3://"):
        raise ValueError("target_url must start with s3://")
    _, path = s3_url.split("s3://", 1)
    bucket, key = path.split("/", 1)
    session = aioboto3.Session()
    async with session.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        aws_session_token=AWS_SESSION_TOKEN,
        region_name=AWS_REGION
    ) as s3_client:
        await s3_client.put_object(Bucket=bucket, Key=key, Body=text.encode("utf-8"))
    return f"https://{bucket}.s3.{AWS_REGION}.amazonaws.com/{key}"

@app.post("/api/v1", response_model=Audio2TextResponse)
async def audio2text_endpoint(request: Audio2TextRequest):
    audio_bytes = await download_audio_if_audio(request.input_url)
    if not audio_bytes:
        # Traverse edge_url
        for node in sorted(request.edge_url.keys()):
            node_url = request.edge_url[node]["URL"]
            audio_bytes = await download_audio_if_audio(node_url)
            if audio_bytes:
                break
    if not audio_bytes:
        return Audio2TextResponse(success=False, message="No audio file found in input_url or edge_url", s3_url=None)
    loop = asyncio.get_event_loop()
    text = await loop.run_in_executor(executor, gemini_audio_to_text, audio_bytes, "audio/wav")
    s3_url = await upload_text_to_s3_async(text, request.target_url)
    return Audio2TextResponse(success=True, message="OK", s3_url=s3_url)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("stt:app", host="0.0.0.0", port=8000, reload=True)