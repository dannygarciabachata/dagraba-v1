"""
Da Graba Studio - SageMaker Inference Client
Used by the Cloud Run FastAPI server to invoke SageMaker async endpoints.

Usage:
    from sagemaker.client import SageMakerMusicGenClient
    
    client = SageMakerMusicGenClient()
    result = await client.generate(
        prompt="warm bolero guitar with soft percussion",
        genre="bolero",
        duration=30
    )
"""

import boto3
import json
import time
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)


class SageMakerMusicGenClient:
    """
    Client to invoke SageMaker async endpoints for music generation.
    Handles the full workflow: upload payload → invoke endpoint → poll for result.
    """

    def __init__(self):
        self.endpoint_name = os.environ.get("SAGEMAKER_ENDPOINT_NAME", "dagraba-musicgen-large-async")
        self.region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        self.bucket = os.environ.get("SAGEMAKER_BUCKET", None)
        
        self.sagemaker_runtime = boto3.client("sagemaker-runtime", region_name=self.region)
        self.s3_client = boto3.client("s3", region_name=self.region)
        self.s3_resource = boto3.resource("s3", region_name=self.region)
        
        # Auto-detect bucket if not set
        if not self.bucket:
            session = boto3.session.Session(region_name=self.region)
            account_id = boto3.client("sts").get_caller_identity()["Account"]
            self.bucket = f"sagemaker-{self.region}-{account_id}"
        
        logger.info(f"SageMaker client initialized: endpoint={self.endpoint_name}, bucket={self.bucket}")

    async def generate(
        self,
        prompt: str,
        genre: str = "bachata",
        duration: int = 30,
        guidance_scale: float = 3.0,
        temperature: float = 0.9,
    ) -> dict:
        """
        Generate music via SageMaker async inference.
        
        Args:
            prompt: Text description of the desired music
            genre: Musical genre for context enrichment
            duration: Duration in seconds (max 30s for musicgen)
            guidance_scale: CFG scale (higher = closer to prompt, lower quality)
            temperature: Randomness (higher = more diverse)
        
        Returns:
            dict with status, audioUrl, and metadata
        """
        # Enrich the prompt with genre context
        enriched_prompt = self._enrich_prompt(prompt, genre)
        
        # Calculate max_new_tokens from duration (50 tokens ≈ 1 second)
        max_tokens = min(int(duration * 50), 1503)  # 1503 = max 30s
        
        # Build payload
        payload = {
            "texts": [enriched_prompt],
            "bucket_name": self.bucket,
            "generation_params": {
                "guidance_scale": guidance_scale,
                "max_new_tokens": max_tokens,
                "do_sample": True,
                "temperature": temperature,
            }
        }
        
        logger.info(f"SageMaker generate: prompt='{enriched_prompt[:80]}...', tokens={max_tokens}")
        
        # Upload payload to S3
        input_key = f"dagraba/musicgen/async_inference/input/request_{int(time.time()*1000)}.json"
        self.s3_client.put_object(
            Bucket=self.bucket,
            Key=input_key,
            Body=json.dumps(payload),
            ContentType="application/json"
        )
        input_s3_uri = f"s3://{self.bucket}/{input_key}"
        
        # Invoke async endpoint
        response = self.sagemaker_runtime.invoke_endpoint_async(
            EndpointName=self.endpoint_name,
            InputLocation=input_s3_uri,
            ContentType="application/json",
            InvocationTimeoutSeconds=3600,
        )
        
        output_location = response.get("OutputLocation")
        logger.info(f"SageMaker async invoked. OutputLocation: {output_location}")
        
        # Poll for result (async-friendly)
        result = await self._poll_for_result(output_location)
        
        return result

    async def _poll_for_result(self, output_location: str, max_wait: int = 300) -> dict:
        """Poll S3 for the async inference result."""
        import asyncio
        
        # Parse S3 URI
        parts = output_location.replace("s3://", "").split("/", 1)
        bucket = parts[0]
        key = parts[1]
        
        start_time = time.time()
        poll_interval = 5  # seconds
        
        while (time.time() - start_time) < max_wait:
            try:
                response = self.s3_client.get_object(Bucket=bucket, Key=key)
                body = json.loads(response["Body"].read().decode("utf-8"))
                logger.info(f"SageMaker result received after {time.time() - start_time:.1f}s")
                
                # Transform result for Da Graba frontend
                return self._transform_result(body)
                
            except self.s3_client.exceptions.NoSuchKey:
                await asyncio.sleep(poll_interval)
            except Exception as e:
                logger.error(f"Polling error: {e}")
                await asyncio.sleep(poll_interval)
        
        return {"status": "TIMEOUT", "message": f"Generation timed out after {max_wait}s"}

    def _transform_result(self, sagemaker_output: dict) -> dict:
        """Transform SageMaker output to Da Graba frontend format."""
        s3_urls = sagemaker_output.get("generated_outputs_s3", [])
        
        # Generate presigned URLs for direct frontend access
        audio_urls = []
        for s3_url in s3_urls:
            parts = s3_url.replace("s3://", "").split("/", 1)
            presigned = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": parts[0], "Key": parts[1]},
                ExpiresIn=3600,  # 1 hour
            )
            audio_urls.append(presigned)
        
        return {
            "status": "SUCCESS",
            "audioUrl": audio_urls[0] if audio_urls else None,
            "allAudioUrls": audio_urls,
            "prompts": sagemaker_output.get("prompts", []),
            "sampling_rate": sagemaker_output.get("sampling_rate", 32000),
            "source": "sagemaker",
        }

    def _enrich_prompt(self, prompt: str, genre: str) -> str:
        """Enrich user prompt with genre-specific context for better generation."""
        genre_hints = {
            "bachata": "Dominican bachata style with romantic guitar, bongos and güira",
            "bolero": "Classic Latin bolero with warm nylon guitar, soft strings and emotional melody",
            "salsa": "Energetic salsa with congas, timbales, piano montuno and brass section",
            "merengue": "Fast merengue rhythm with tambora, güira and accordion",
            "cumbia": "Colombian cumbia with accordion, gaita and alegre drums",
            "reggaeton": "Modern reggaeton with dembow rhythm, 808 bass and synths",
            "son": "Traditional Cuban son with tres guitar, bongos and maracas",
        }
        
        genre_context = genre_hints.get(genre.lower(), "")
        if genre_context:
            return f"{prompt}. {genre_context}"
        return prompt
