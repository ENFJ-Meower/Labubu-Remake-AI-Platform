# ---- Building Stage ----
FROM python:3.10-slim AS builder

WORKDIR /app

# Install Dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --user -r requirements.txt

# ---- Running Stage ----
FROM python:3.10-slim

WORKDIR /app

# Set Timezone
ENV TZ=Asia/Shanghai

# Copy Dependencies and Source Code
COPY --from=builder /root/.local /root/.local
COPY . .

# Set PATH
ENV PATH=/root/.local/bin:$PATH

# Set Default Port
EXPOSE 8000

# Start Service
CMD ["uvicorn", "tts:app", "--host", "0.0.0.0", "--port", "8000"]
