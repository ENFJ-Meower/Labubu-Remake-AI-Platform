import asyncio
import os
from concurrent.futures import ThreadPoolExecutor
from typing import Optional, Dict, List

import aioboto3
import httpx
from fastapi import FastAPI
from google import genai
from google.genai import types
from pydantic import BaseModel

app = FastAPI(title="AI Agent Microservice API", description="Picture-to-Text API")

class Image2TextRequest(BaseModel):
    prompt: str
    input_url: str
    edge_url: Dict[str, Dict[str, str]]
    target_url: str

class Image2TextResponse(BaseModel):
    success: bool
    message: str
    result: Optional[str] = None
    s3_url: Optional[str] = None

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

executor = ThreadPoolExecutor(max_workers=8)

IMAGE_MIME_TYPES = {"image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"}

async def download_image_if_image(url: str) -> (Optional[bytes], Optional[str]):
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "").lower().split(";")[0]
            if content_type in IMAGE_MIME_TYPES:
                return resp.content, content_type
            return None, None
    except Exception:
        return None, None

def gemini_multi_image_to_text(images: List[dict], final_prompt: str) -> str:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY environment variable is not set.")
    client = genai.Client(api_key=GOOGLE_API_KEY)
    contents = []
    if final_prompt:
        contents.append(final_prompt)
    for img in images:
        contents.append(types.Part.from_bytes(
            data=img["bytes"],
            mime_type=img["mime_type"],
        ))
        if img.get("prompt"):
            contents.append(img["prompt"])
    resp = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents
    )
    return resp.text

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

@app.post("/api/v1", response_model=Image2TextResponse)
async def image2text_endpoint(request: Image2TextRequest):
    images = []
    found_image = False
    # 1. input_url
    img_bytes, mime_type = await download_image_if_image(request.input_url)
    if img_bytes:
        found_image = True
        images.append({"bytes": img_bytes, "mime_type": mime_type, "prompt":request.prompt})
    # 2. edge_url
    for node, info in (request.edge_url or {}).items():
        url = info.get("URL")
        prompt = info.get("prompt", "")
        if url:
            img_bytes, mime_type = await download_image_if_image(url)
            if img_bytes:
                found_image = True
                images.append({"bytes": img_bytes, "mime_type": mime_type, "prompt": prompt})
    if not found_image:
        return Image2TextResponse(success=False, message="No valid image found in any link.", result=None, s3_url=None)
    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(executor, gemini_multi_image_to_text, images, request.prompt)
        s3_written_url = await upload_text_to_s3_async(result, request.target_url)
        return Image2TextResponse(success=True, message="Success", result=result, s3_url=s3_written_url)
    except Exception as e:
        return Image2TextResponse(success=False, message=f"Image understanding failed: {str(e)}", result=None, s3_url=None)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ptt:app", host="0.0.0.0", port=8000, reload=True)
