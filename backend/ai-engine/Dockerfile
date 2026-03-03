# Use Python 3.11 bookworm (full) for robust compilation
FROM python:3.11-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    pkg-config \
    libavcodec-dev \
    libavformat-dev \
    libavutil-dev \
    libswscale-dev \
    libswresample-dev \
    libavdevice-dev \
    libsndfile1 \
    build-essential \
    python3-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and friends
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Set the working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port Cloud Run expects
EXPOSE 8080

# Command to run the FastAPI application
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
