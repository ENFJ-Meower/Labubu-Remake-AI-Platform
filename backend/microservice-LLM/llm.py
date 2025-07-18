from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from typing import Optional, Dict, Any
import json
from google import genai
from google.genai import types
import httpx
import aioboto3
import urllib.parse

# Create FastAPI app
app = FastAPI(title="AI Agent Microservice API", description="LLM API")

# Request model
default_model = "gemini-2.5-flash"

# Gemini API config
# Recommended to use the environment variable GOOGLE_API_KEY
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

client = genai.Client(api_key=GOOGLE_API_KEY)

class LLMRequest(BaseModel):
    prompt: str
    input_url: str
    edge_url: Dict[str, Dict[str, str]]
    target_url: str

@app.post("/api/v1")
async def llm_graph_endpoint(request: LLMRequest):
    async def download_text_if_possible(url: str) -> Optional[str]:
        parsed = urllib.parse.urlparse(url)
        if not (parsed.scheme and parsed.netloc):
            return None
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.get(url)
                resp.raise_for_status()
                content_type = resp.headers.get("content-type", "")
                if content_type.startswith("text/") or "json" in content_type or "xml" in content_type or content_type == "application/x-www-form-urlencoded":
                    return resp.text
                try:
                    return resp.content.decode("utf-8")
                except Exception:
                    return None
        except Exception:
            return None
    input_text = await download_text_if_possible(request.input_url)
    if not input_text:
        input_text = ""
    edge_parts = []
    for node in sorted(request.edge_url.keys()):
        node_prompt = request.edge_url[node].get("prompt", "")
        node_url = request.edge_url[node].get("URL", "")
        node_text = await download_text_if_possible(node_url) or ""
        edge_parts.append(node_prompt + node_text)
    full_text = request.prompt + "\n" + input_text + "\n".join(edge_parts)
    print("text to process:"+full_text)
    if not (input_text.strip() or any(edge_parts)):
        return {"success": False, "message": "All input URLs are invalid or inaccessible.", "s3_url": None}
    try:
        import asyncio
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: client.models.generate_content(
                model=default_model,
                contents=full_text,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    max_output_tokens=2048
                )
            )
        )
        result_text = response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")
    async def upload_text_to_s3(text: str, s3_url: str) -> str:
        try:
            if not s3_url.startswith("s3://"):
                return {"success": False, "message": "target_url format error: must start with s3://", "s3_url": None}
            _, path = s3_url.split("s3://", 1)
            if "/" not in path:
                return {"success": False, "message": "target_url format error: missing bucket/key", "s3_url": None}
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
        except Exception as e:
            return {"success": False, "message": f"S3 upload failed: {str(e)}", "s3_url": None}
    s3_url = await upload_text_to_s3(result_text, request.target_url)
    if isinstance(s3_url, dict) and not s3_url.get("success", True):
        return s3_url
    return {"success": True, "message":"OK", "s3_url": s3_url}

if __name__ == "__main__":
    import uvicorn
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "YOUR_GEMINI_API_KEY":
        print("Warning: GOOGLE_API_KEY environment variable is not set.")
        print("Please set the environment variable: export GOOGLE_API_KEY=your_gemini_api_key")
    uvicorn.run(
        "llm:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
