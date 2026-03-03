from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import os

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI App
app = FastAPI(
    title="Da Graba Studio - AI Inference Engine",
    description="Local Python AI Generation Backend inspired by HeartMuLa 7B-os",
    version="1.0.0"
)

# Configure CORS so the Next.js frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to localhost:3000 or the specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the Music Generator Engine (lazy loaded)
engine = None
sagemaker_client = None
USE_SAGEMAKER = os.environ.get("USE_SAGEMAKER", "false").lower() == "true"

def get_engine():
    global engine
    if engine is None:
        logger.info("Lazy-loading HeartMuLa engine...")
        from inference import HeartMuLaMusicGenerator
        engine = HeartMuLaMusicGenerator(use_gpu=False)  # Cloud Run has no GPU
        engine.load_base_model()
        logger.info("Engine loaded successfully.")
    return engine

def get_sagemaker_client():
    global sagemaker_client
    if sagemaker_client is None:
        logger.info("Initializing SageMaker MusicGen client...")
        from sagemaker.client import SageMakerMusicGenClient
        sagemaker_client = SageMakerMusicGenClient()
        logger.info("SageMaker client ready.")
    return sagemaker_client

# In-memory mock DB for task status polling
MOCK_DB = {}

class GenerateRequest(BaseModel):

    prompt: str
    modelId: str
    genre: str = "acoustic"
    duration: int = 30 # requested duration in seconds

class GenerateResponse(BaseModel):
    success: bool
    taskId: str
    message: str = ""

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up Da Graba AI Inference Engine (lazy mode)...")
    logger.info("Engine will be loaded on first request.")

@app.get("/health")
async def health_check():
    """Simple health check endpoint — responds immediately without loading the engine."""
    return {
        "status": "ok",
        "engine_loaded": engine is not None,
        "use_sagemaker": USE_SAGEMAKER,
    }

@app.post("/generate", response_model=GenerateResponse)
async def generate_music(req: GenerateRequest):
    """
    Main endpoint for triggering the AI music generation.
    Receives the prompt and the ID of the trained DNA weights.
    """
    logger.info(f"Received generation request for DNA: {req.modelId}, genre: {req.genre}")
    
    try:
        # Route to SageMaker if enabled (production GPU inference)
        if USE_SAGEMAKER:
            logger.info("Routing to SageMaker async endpoint...")
            import uuid
            task_id = f"ai_gen_{uuid.uuid4().hex[:8]}"
            
            result = await get_sagemaker_client().generate(
                prompt=req.prompt,
                genre=req.genre,
                duration=req.duration,
            )
            
            MOCK_DB[task_id] = {
                "status": result.get("status", "SUCCESS"),
                "audioUrl": result.get("audioUrl", ""),
                "imageUrl": "",
                "lyrics": "",
                "title": f"AI Generated - {req.genre}",
                "tags": [req.genre],
                "prompt": req.prompt,
                "source": "sagemaker",
            }
            
            return GenerateResponse(
                success=True,
                taskId=task_id,
                message="Generated via SageMaker GPU inference."
            )
        
        # Fallback: local engine (dev mode)
        result = get_engine().generate(
            prompt=req.prompt,
            dna_id=req.modelId,
            genre=req.genre
        )
        
        import uuid
        task_id = f"ai_gen_{uuid.uuid4().hex[:8]}"
        
        MOCK_DB[task_id] = {
            "status": "SUCCESS",
            "audioUrl": result["audioUrl"],
            "imageUrl": result["imageUrl"],
            "lyrics": result["lyrics"],
            "title": result["title"],
            "tags": result["tags"],
            "prompt": req.prompt
        }
        
        logger.info(f"Generation successful for Task {task_id}. Audio URL: {result['audioUrl']}")
        
        return GenerateResponse(
            success=True, 
            taskId=task_id, 
            message="Inference job started/completed successfully."
        )

    except Exception as e:
        logger.error(f"Inference error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Engine failed to process: {str(e)}")

@app.get("/status/{task_id}")
async def get_status(task_id: str):
    """Endpoint for frontend to poll generation status."""
    if task_id in MOCK_DB:
        return MOCK_DB[task_id]
    return {"status": "PENDING"}

from typing import List, Optional

class TrackCommand(BaseModel):
    id: str
    measure: int
    category: str
    value: str

class OrchestraRequest(BaseModel):
    track_name: str
    genre: str = "bachata"
    pdf_data: Optional[str] = None # Base64
    audio_reference_data: Optional[str] = None # Base64 data if audio reference
    reference_type: str = "pdf" # "pdf" or "audio"
    commands: List[TrackCommand] = []
    creative_instruction: Optional[str] = None

@app.post("/orchestra")
async def orchestra_process(req: OrchestraRequest):
    """
    New Endpoint for the AI Orchestral Engine.
    Processes a specific track (optionally with PDF score, audio reference, and musical commands).
    """
    logger.info(f"Orchestra: Received track '{req.track_name}' for genre: {req.genre}")
    logger.info(f"Orchestra: Mode: {req.reference_type} | Commands: {len(req.commands)}")
    
    try:
        # Pass full payload to generator (which calls Modal)
        result = await get_engine().generate_orchestra(
            track_name=req.track_name,
            genre=req.genre,
            pdf_data=req.pdf_data,
            audio_reference_data=req.audio_reference_data,
            reference_type=req.reference_type,
            commands=[cmd.dict() for cmd in req.commands],
            creative_instruction=req.creative_instruction
        )
        return result
    except Exception as e:
        logger.error(f"Orchestra processing failed: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    logger.info("Starting local server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
