# DaGraba Local Generation Test

import sys
import os
import json
import logging

# Add ai-engine to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', 'ai-engine')))

from inference import HeartMuLaMusicGenerator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("Test")

def main():
    logger.info("Initializing DaGraba Architecture (Agents A, B, C, D)")
    engine = HeartMuLaMusicGenerator()
    
    # Simulate a frontend request
    prompt = "A high energy futuristic reggaeton beat with heavy bass"
    genre = "reggaeton_futurista"
    dna_id = "default"
    
    logger.info(f"Triggering generation payload: {prompt} | Style: {genre}")
    
    result = engine.generate(prompt=prompt, dna_id=dna_id, genre=genre)
    
    logger.info("=========================================")
    logger.info("Result Metadata:")
    logger.info(json.dumps(result, indent=2))
    logger.info("=========================================")
    
    if result.get("success"):
        logger.info(f"✅ Pipeline executed successfully.")
        logger.info(f"🎧 Final Audio URL: {result.get('audioUrl')}")
    else:
        logger.error("❌ Pipeline failed.")

if __name__ == "__main__":
    main()
