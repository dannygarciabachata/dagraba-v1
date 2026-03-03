#!/bin/bash

# Configuration
PROJECT_ID="dagraba-studio-official-23866"
SERVICE_NAME="ai-engine"
REGION="us-central1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME:latest"

echo "🚀 Starting Deployment for $SERVICE_NAME to project $PROJECT_ID..."

# 1. Build and Push using Google Cloud Build
echo "📦 Building and Pushing image via Google Cloud Build..."
# We specify the directory where the Dockerfile is located
gcloud builds submit backend/ai-engine --tag $IMAGE_TAG --project $PROJECT_ID

# 2. Deploy to Cloud Run
echo "🌍 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_TAG \
  --project $PROJECT_ID \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 600 \
  --cpu-boost \
  --set-env-vars "ALLOW_ORIGINS=*,MODAL_PROJECT_NAME=Da-Graba-AI-Engine"

echo "✅ Deployment complete!"
gcloud run services describe $SERVICE_NAME --project $PROJECT_ID --region $REGION --format='value(status.url)'
