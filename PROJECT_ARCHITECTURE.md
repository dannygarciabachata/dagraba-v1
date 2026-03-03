# Da Graba Studio - AI Music Pipeline Architecture

## 1. Overview
Da Graba Studio uses a multi-agent AI pipeline to generate high-fidelity, customized music. The system is designed to run locally on Apple Silicon (Metal/MPS) while being ready for cloud scaling via **Google Cloud Run** and **Modal**.

## 2. Core Agents
- **Agent B (Composer)**: Uses `transformers` with `facebook/musicgen-small` to generate core musical ideas from text prompts.
- **Agent C (Mimic)**: Applies RVC (Retrieval-based Voice Conversion) to the generated tracks, replacing generic vocals with specific artist "DNA" (`.pth` models).
- **Agent D (Mixer)**: Handles final audio mastering, normalization, and EQ using `pydub` and `ffmpeg`.

## 3. Technology Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide React.
- **Backend (AI Engine)**: FastAPI (Python 3.11), PyTorch (MPS acceleration), Transformers.
- **Deployment**:
    - **Local**: Full pipeline runs on MacOS with Metal acceleration.
    - **Cloud (Inference)**: Google Cloud Run (Dockerized FastAPI with Python 3.11).
    - **Cloud (Training)**: Modal (GPU-accelerated fine-tuning and heavy inference passes).

## 4. Performance Optimizations
- **Model Persistency**: Models are loaded once and kept in memory to reduce latency.
- **Duration Tuning**: Default generation is set to 15s to prioritize rapid experimentation.
- **MPS Acceleration**: Native utilization of Apple Silicon GPU for sub-minute generation times.

## 5. Deployment Strategy
### Google Cloud Run (Backend)
To deploy the backend to Google Cloud:
1. Build the Docker image specifically requesting Python 3.11.
2. Ensure `torch` and `transformers` are installed with CPU support (or T4 GPU if available in Cloud Run).
3. Set `PORT=8000` and `ALLOW_ORIGINS` to the frontend production domain.

### Modal (Training & Heavy Jobs)
Use Modal for:
- Fine-tuning new Voice/Instrument DNA models using large datasets.
- 10-minute high-quality rendering jobs that exceed local timeout limits.
- Parallelized batch processing for dataset labeling.
