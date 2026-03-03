"""
Da Graba Studio - SageMaker Auto-Scaling Configuration
Configures scale-to-zero for the MusicGen async endpoint.

Run this AFTER deploy_musicgen.py has successfully deployed the endpoint.
"""

import boto3
import json


ENDPOINT_NAME = "dagraba-musicgen-large-async"
REGION = "us-east-1"

# Auto Scaling Client
aas_client = boto3.client("application-autoscaling", region_name=REGION)
sm_client = boto3.client("sagemaker", region_name=REGION)

resource_id = f"endpoint/{ENDPOINT_NAME}/variant/AllTraffic"

# ─── 1. Register Scalable Target (0-2 instances) ────────────────────────────
print(f"Registering scalable target for {ENDPOINT_NAME}...")

aas_client.register_scalable_target(
    ServiceNamespace="sagemaker",
    ResourceId=resource_id,
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",
    MinCapacity=0,  # Scale to zero!
    MaxCapacity=2,
)

# ─── 2. Target Tracking Scaling Policy ──────────────────────────────────────
# Scale based on SageMakerVariantInvocationsPerInstance
print("Creating scaling policy...")

aas_client.put_scaling_policy(
    PolicyName="dagraba-musicgen-scaling-policy",
    ServiceNamespace="sagemaker",
    ResourceId=resource_id,
    ScalableDimension="sagemaker:variant:DesiredInstanceCount",
    PolicyType="TargetTrackingScaling",
    TargetTrackingScalingPolicyConfiguration={
        "TargetValue": 1.0,  # 1 invocation per instance
        "CustomizedMetricSpecification": {
            "MetricName": "ApproximateBacklogSizePerInstance",
            "Namespace": "AWS/SageMaker",
            "Dimensions": [
                {"Name": "EndpointName", "Value": ENDPOINT_NAME}
            ],
            "Statistic": "Average",
        },
        "ScaleInCooldown": 600,   # 10 min before scale down
        "ScaleOutCooldown": 120,  # 2 min before scale up
    },
)

print(f"""
✅ Auto-scaling configured!
   Endpoint: {ENDPOINT_NAME}
   Min instances: 0 (scale-to-zero)
   Max instances: 2
   Scale-in cooldown: 10 minutes
   Scale-out cooldown: 2 minutes
   
   💡 When there's no traffic, the endpoint scales to 0 instances ($0/hr).
   💡 First request after idle will take ~5-8 min (cold start).
""")
