import os
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
import io
import wave
import tempfile
import base64

# FastAPI app
app = FastAPI(title="AI Agent Microservice API", description="Text-to-Speech API")

# Request model
class TTSRequest(BaseModel):
    input_url: str
    edge_url: Dict[str, Dict[str, str]]
    target_url: str

# Response model
class TTSResponse(BaseModel):
    success: bool
    message: str
    s3_url: Optional[str] = None

# Gemini TTS config
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
# S3 config
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

executor = ThreadPoolExecutor(max_workers=8)

async def download_text_async(url: str) -> str:
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.text

async def download_text_if_text(url: str) -> Optional[str]:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "").lower()
            if content_type.startswith("text/") or "json" in content_type or "xml" in content_type or content_type == "application/x-www-form-urlencoded":
                return resp.text
            return None
    except Exception:
        return None

def gemini_tts(text: str) -> str:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY environment variable is not set")
    client = genai.Client(api_key=GOOGLE_API_KEY)
    speech_config = types.SpeechConfig(
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name="Kore"
            )
        )
    )
    config = types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=speech_config
    )
    response = client.models.generate_content(
        model="gemini-2.5-flash-preview-tts",
        contents=text,
        config=config
    )
    pcm = response.candidates[0].content.parts[0].inline_data.data
    #pcm = base64.b64decode(pcm)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmpfile:
        with wave.open(tmpfile, "wb") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)  # 16bit
            wf.setframerate(24000)
            wf.writeframes(pcm)
        tmpfile_path = tmpfile.name
    return tmpfile_path

async def gemini_tts_async(text: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, gemini_tts, text)

async def upload_to_s3_async(file_path: str, s3_url: str) -> str:
    import os
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
        print(file_path)
        with open(file_path, "rb") as f:
            await s3_client.put_object(Bucket=bucket, Key=key, Body=f)
    os.remove(file_path)
    return f"https://{bucket}.s3.{AWS_REGION}.amazonaws.com/{key}"

@app.post("/api/v1", response_model=TTSResponse)
async def tts_endpoint(request: TTSRequest):
    text = await download_text_if_text(request.input_url)
    if not text:
        # Traverse edge_url
        for node in sorted(request.edge_url.keys()):
            node_url = request.edge_url[node]["URL"]
            text = await download_text_if_text(node_url)
            if text:
                break
    if not text:
        return TTSResponse(success=False, message="No text file found in input_url or edge_url", s3_url=None)
    try:
        if not text.strip():
            return TTSResponse(success=False, message="Input text is empty", s3_url=None)
        # Gemini TTS generates audio file
        audio_file_path = await gemini_tts_async(text)
        # Upload to S3
        s3_url = await upload_to_s3_async(audio_file_path, request.target_url)
        return TTSResponse(success=True, message="OK", s3_url=s3_url)
    except Exception as e:
        return TTSResponse(success=False, message=f"TTS processing failed: {str(e)}", s3_url=None)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("tts:app", host="0.0.0.0", port=8000, reload=True)
