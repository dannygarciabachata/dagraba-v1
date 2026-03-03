import boto3
import time
from datetime import datetime, timedelta

log_client = boto3.client('logs')
log_group_name = "/aws/sagemaker/Endpoints/dagraba-musicgen-large-async"

try:
    # Get the latest log stream
    response = log_client.describe_log_streams(
        logGroupName=log_group_name,
        orderBy='LastEventTime',
        descending=True,
        limit=1
    )
    
    if not response['logStreams']:
        print(f"No log streams found for {log_group_name}")
        exit(0)
        
    stream_name = response['logStreams'][0]['logStreamName']
    print(f"Fetching logs from stream: {stream_name}")
    
    # Get log events from the last hour
    start_time = int((datetime.now() - timedelta(hours=1)).timestamp() * 1000)
    
    events = log_client.get_log_events(
        logGroupName=log_group_name,
        logStreamName=stream_name,
        startTime=start_time,
        startFromHead=False
    )
    
    lines = [event['message'].strip() for event in events['events']]
    for line in lines[-50:]:  # Print last 50 lines
        print(line)
        
except Exception as e:
    print(f"Error fetching logs: {e}")
