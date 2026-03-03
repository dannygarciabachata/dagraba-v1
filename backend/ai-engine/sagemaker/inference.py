"""
Da Graba Studio - SageMaker MusicGen Inference Handler
This runs INSIDE the SageMaker container to serve the MusicGen model.

Based on: https://github.com/aws-samples/inference-audiocraft-musicgen-on-amazon-sagemaker
"""

import torch
import os
import uuid
import json
import boto3
import scipy.io.wavfile
import numpy as np
from transformers import AutoProcessor, MusicgenForConditionalGeneration


def model_fn(model_dir):
    """Load the MusicGen model from HuggingFace"""
    model_id = os.environ.get("HF_MODEL_ID", "facebook/musicgen-large")
    print(f"Loading model: {model_id}")
    model = MusicgenForConditionalGeneration.from_pretrained(model_id)
    print(f"Model loaded successfully: {model_id}")
    return model


def predict_fn(data, model):
    """
    Generate music from text prompts.
    
    Input format:
    {
        "texts": ["warm hip hop beats on a sunny day"],
        "bucket_name": "my-s3-bucket",
        "generation_params": {
            "guidance_scale": 3,
            "max_new_tokens": 1200,
            "do_sample": true,
            "temperature": 0.9
        }
    }
    """
    texts = data.get("texts", ["ambient chill lofi beats"])
    bucket_name = data.get("bucket_name", None)
    generation_params = data.get("generation_params", {})
    
    # Default generation parameters
    defaults = {
        "guidance_scale": 3,
        "max_new_tokens": 1200,  # ~24 seconds
        "do_sample": True,
        "temperature": 0.9,
    }
    defaults.update(generation_params)
    
    # Process inputs
    model_id = os.environ.get("HF_MODEL_ID", "facebook/musicgen-large")
    processor = AutoProcessor.from_pretrained(model_id)
    inputs = processor(text=texts, padding=True, return_tensors="pt")
    
    # Move to GPU if available
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    
    print(f"Generating music for {len(texts)} prompt(s) on {device}...")
    print(f"Params: {defaults}")
    
    # Generate
    audio_values = model.generate(
        **inputs.to(device),
        **defaults
    )
    
    sampling_rate = model.config.audio_encoder.sampling_rate
    result = {"generated_outputs_s3": [], "sampling_rate": sampling_rate}
    
    # Write WAVs and upload to S3
    s3_client = boto3.client("s3")
    
    for i, audio in enumerate(audio_values):
        # Convert to numpy
        audio_np = audio.cpu().numpy()
        if audio_np.ndim == 2:
            audio_np = audio_np[0]  # Take first channel for mono
        
        # Normalize to int16
        audio_int16 = np.int16(audio_np / np.max(np.abs(audio_np)) * 32767)
        
        # Save locally
        filename = f"/tmp/dagraba_gen_{uuid.uuid4().hex[:8]}.wav"
        scipy.io.wavfile.write(filename, sampling_rate, audio_int16)
        
        # Upload to S3
        if bucket_name:
            s3_key = f"dagraba/musicgen/generated/{os.path.basename(filename)}"
            s3_client.upload_file(filename, bucket_name, s3_key)
            s3_url = f"s3://{bucket_name}/{s3_key}"
            result["generated_outputs_s3"].append(s3_url)
            print(f"Uploaded: {s3_url}")
        
        # Cleanup
        os.remove(filename)
    
    result["prompts"] = texts
    result["status"] = "SUCCESS"
    
    return result


def input_fn(request_body, request_content_type):
    """Parse input data"""
    if request_content_type == "application/json":
        return json.loads(request_body)
    raise ValueError(f"Unsupported content type: {request_content_type}")


def output_fn(prediction, response_content_type):
    """Format output"""
    return json.dumps(prediction)
