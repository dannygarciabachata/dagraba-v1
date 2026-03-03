from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
from inference import HeartMuLaMusicGenerator

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

# Initialize the Music Generator Engine
engine = HeartMuLaMusicGenerator(use_gpu=True)

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
    logger.info("Starting up Da Graba AI Inference Engine...")
    # Preload the base models into VRAM to reduce latency on first request
    engine.load_base_model()
    logger.info("Engine is ready to receive inference requests.")

@app.get("/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "engine_loaded": engine.is_loaded}

@app.post("/generate", response_model=GenerateResponse)
async def generate_music(req: GenerateRequest):
    """
    Main endpoint for triggering the AI music generation.
    Receives the prompt and the ID of the trained DNA weights.
    """
    logger.info(f"Received generation request for DNA: {req.modelId}, genre: {req.genre}")
    
    try:
        # 1. Execute the inference pass
        result = engine.generate(
            prompt=req.prompt,
            dna_id=req.modelId,
            genre=req.genre
        )
        
        # 2. In a real asynchronous system (Celery/Redis), we'd return a task ID immediately
        # and process the generation in the background. 
        # For this prototype, we're mimicking the immediate return of a task ID
        # while storing the mock result in memory or DB so the frontend polling can find it.
        
        import uuid
        task_id = f"ai_gen_{uuid.uuid4().hex[:8]}"
        
        # We simulate saving the final generation data somewhere the frontend can access it
        # (Usually this would be saved to Convex or Prisma. Here we pretend the frontend polling
        # will just find these 'files' magically, or we simulate by generating a direct success dict
        # if the frontend is polling Convex).
        
        # Save to an in-memory dictionary for status polling
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

if __name__ == "__main__":
    logger.info("Starting local server on port 8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

