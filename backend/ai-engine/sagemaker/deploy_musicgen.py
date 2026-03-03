"""
Da Graba Studio - SageMaker MusicGen Deployment Script
Deploys facebook/musicgen-large on an async SageMaker endpoint.

Prerequisites:
  - AWS CLI configured: aws configure
  - SageMaker execution role with s3, sagemaker, sns permissions
  - pip install sagemaker boto3
"""

import sagemaker
import boto3
import time
import json
import os

# ─── Configuration ───────────────────────────────────────────────────────────
MODEL_NAME = "facebook/musicgen-large"
ENDPOINT_NAME = "dagraba-musicgen-large-async"
INSTANCE_TYPE = "ml.g5.xlarge"  # 24GB VRAM, ideal for musicgen-large
REGION = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")

# ─── Session & Role ─────────────────────────────────────────────────────────
session = sagemaker.Session()
bucket = session.default_bucket()
role = sagemaker.get_execution_role()

print(f"SageMaker Session Bucket: {bucket}")
print(f"Execution Role: {role}")
print(f"Region: {REGION}")

# ─── 1. Create Model Serving Package ────────────────────────────────────────
# The inference.py and requirements.txt are in the sagemaker/ directory
import tarfile

def create_model_tar():
    """Package inference code into model.tar.gz"""
    tar_path = "model.tar.gz"
    with tarfile.open(tar_path, "w:gz") as tar:
        tar.add("inference.py", arcname="code/inference.py")
        tar.add("requirements.txt", arcname="code/requirements.txt")
    return tar_path

tar_path = create_model_tar()

# Upload to S3
s3_model_key = f"dagraba/musicgen/model/model.tar.gz"
s3_model_location = f"s3://{bucket}/{s3_model_key}"
boto3.resource("s3").Bucket(bucket).upload_file(tar_path, s3_model_key)
print(f"Model artifacts uploaded to: {s3_model_location}")

# ─── 2. Create HuggingFace Model ────────────────────────────────────────────
from sagemaker.huggingface import HuggingFaceModel

huggingface_model = HuggingFaceModel(
    name=ENDPOINT_NAME,
    model_data=s3_model_location,
    role=role,
    env={
        'TS_MAX_REQUEST_SIZE': '100000000',
        'TS_MAX_RESPONSE_SIZE': '100000000',
        'TS_DEFAULT_RESPONSE_TIMEOUT': '3600',
        'HF_MODEL_ID': MODEL_NAME,
    },
    transformers_version="4.37",
    pytorch_version="2.1",
    py_version="py310",
)

# ─── 3. Create SNS Topics (optional — skip if no SNS permissions) ────────────
success_topic = None
error_topic = None

try:
    sns_client = boto3.client("sns")
    timestamp = int(time.time())
    success_topic = sns_client.create_topic(
        Name=f"dagraba-musicgen-success-{timestamp}"
    )["TopicArn"]
    error_topic = sns_client.create_topic(
        Name=f"dagraba-musicgen-error-{timestamp}"
    )["TopicArn"]
    print(f"Success SNS Topic: {success_topic}")
    print(f"Error SNS Topic: {error_topic}")
except Exception as e:
    print(f"⚠️  SNS topics skipped (no permissions): {e}")
    print("   Deployment will continue without notifications.")

# ─── 4. Configure Async Inference ───────────────────────────────────────────
from sagemaker.async_inference import AsyncInferenceConfig

async_kwargs = {
    "output_path": f"s3://{bucket}/dagraba/musicgen/async_inference/output",
}
if success_topic and error_topic:
    async_kwargs["notification_config"] = {
        "SuccessTopic": success_topic,
        "ErrorTopic": error_topic,
    }

async_config = AsyncInferenceConfig(**async_kwargs)

# ─── 5. Clean up any previous failed endpoint ───────────────────────────────
sm_client = boto3.client("sagemaker")
try:
    sm_client.describe_endpoint(EndpointName=ENDPOINT_NAME)
    print(f"⚠️  Found existing endpoint '{ENDPOINT_NAME}', deleting...")
    sm_client.delete_endpoint(EndpointName=ENDPOINT_NAME)
    print("   Waiting for endpoint deletion...")
    import time as t
    t.sleep(30)
    # Also clean up endpoint config and model
    try:
        sm_client.delete_endpoint_config(EndpointConfigName=ENDPOINT_NAME)
    except:
        pass
    try:
        sm_client.delete_model(ModelName=ENDPOINT_NAME)
    except:
        pass
    print("   Previous endpoint cleaned up.")
except sm_client.exceptions.ClientError:
    print(f"   No previous endpoint found. Deploying fresh.")

# ─── 6. Deploy ──────────────────────────────────────────────────────────────
print(f"\n🚀 Deploying {MODEL_NAME} to endpoint: {ENDPOINT_NAME}")
print(f"   Instance: {INSTANCE_TYPE}")
print(f"   Container startup timeout: 900s (15 min)")
print(f"   This may take 10-15 minutes...\n")

async_predictor = huggingface_model.deploy(
    initial_instance_count=1,
    instance_type=INSTANCE_TYPE,
    async_inference_config=async_config,
    endpoint_name=ENDPOINT_NAME,
    container_startup_health_check_timeout=900,  # 15 min for large model download
)

print(f"\n✅ Deployment complete!")
print(f"   Endpoint: {ENDPOINT_NAME}")
print(f"   Output S3: s3://{bucket}/dagraba/musicgen/async_inference/output")

# ─── 6. Save Configuration for Cloud Run ────────────────────────────────────
config = {
    "endpoint_name": ENDPOINT_NAME,
    "bucket": bucket,
    "region": REGION,
    "success_topic": success_topic,
    "error_topic": error_topic,
    "instance_type": INSTANCE_TYPE,
    "model_name": MODEL_NAME,
}

with open("sagemaker_config.json", "w") as f:
    json.dump(config, f, indent=2)

print(f"\n📄 Configuration saved to sagemaker_config.json")
print(f"   Set these env vars in Cloud Run:")
print(f"   SAGEMAKER_ENDPOINT_NAME={ENDPOINT_NAME}")
print(f"   AWS_DEFAULT_REGION={REGION}")
print(f"   SAGEMAKER_BUCKET={bucket}")
