import os
import glob
import json
import logging
import argparse
import subprocess

logger = logging.getLogger("Dataset Labeler")
logger.setLevel(logging.INFO)
# Basic console logging
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
logger.addHandler(ch)

def parse_args():
    parser = argparse.ArgumentParser(description="Prepare custom DNA audio for LoRA training")
    parser.add_argument("--input_dir", type=str, required=True, help="Path to raw audio folder")
    parser.add_argument("--output_dir", type=str, required=True, help="Where to save 30s chunks and metadata")
    parser.add_argument("--artist_name", type=str, required=True, help="Name of the artist/DNA profile")
    parser.add_argument("--genre", type=str, required=True, help="Base genre of the tracks")
    parser.add_argument("--bpm", type=int, default=120, help="Approximate BPM for text prompt")
    return parser.parse_args()

def split_and_normalize(input_file: str, output_base_dir: str, prefix: str) -> list:
    """
    Uses ffmpeg to split a long track into 30 second chunks and normalizes them.
    Returns a list of generated chunk filenames.
    """
    os.makedirs(output_base_dir, exist_ok=True)
    base_name = os.path.splitext(os.path.basename(input_file))[0]
    output_pattern = os.path.join(output_base_dir, f"{prefix}_{base_name}_chunk%03d.wav")
    
    logger.info(f"Processing and splitting {input_file}...")
    
    cmd = [
        "ffmpeg", "-y", "-i", input_file,
        "-f", "segment", "-segment_time", "30",
        "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "2", # Standard 44.1khz Stereo WAV
        output_pattern
    ]
    
    try:
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        # Find all generated chunks
        chunks = glob.glob(os.path.join(output_base_dir, f"{prefix}_{base_name}_chunk*.wav"))
        return chunks
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to process {input_file}: {e}")
        return []

def create_jsonl_metadata(chunks: list, output_dir: str, artist: str, genre: str, bpm: int):
    """
    Creates the metadata.jsonl file required by AudioCraft/MusicGen training scripts.
    Format: {"path": "chunk.wav", "text": "A salsa track by Artist, 120 bpm, upbeat", "duration": 30.0}
    """
    jsonl_path = os.path.join(output_dir, "metadata.jsonl")
    
    logger.info(f"Generating mapping metadata to {jsonl_path}...")
    
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for chunk in chunks:
            # Calculate actual duration using ffprobe to be accurate
            duration = 30.0
            try:
                probe_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", chunk]
                result = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
                duration = float(result.stdout.strip())
            except Exception:
                pass # Default to 30.0 if probe fails
                
            # Discard chunks that are too short to train on (e.g. at the end of a song)
            if duration < 5.0:
                continue
                
            # Create a descriptive prompt linking the artist to the style
            text_prompt = f"A {genre} track in the style of {artist}, high fidelity, dynamic, {bpm} bpm"
            
            # The path needs to be relative to the jsonl file for standard trainers
            rel_path = os.path.basename(chunk)
            
            record = {
                "path": rel_path,
                "text": text_prompt,
                "duration": duration
            }
            
            f.write(json.dumps(record) + "\n")
            
    logger.info(f"Successfully wrote metadata for {len(chunks)} chunks.")

def main():
    args = parse_args()
    
    # 1. Find all audio files
    audio_files = []
    for ext in ["*.wav", "*.mp3", "*.flac"]:
        audio_files.extend(glob.glob(os.path.join(args.input_dir, ext)))
        
    if not audio_files:
        logger.error(f"No audio files found in {args.input_dir}")
        return
        
    logger.info(f"Found {len(audio_files)} files. Starting auto-labeling protocol for '{args.artist_name}'.")
    
    all_chunks = []
    
    for idx, audio_file in enumerate(audio_files):
        prefix = f"{args.artist_name.replace(' ', '_').lower()}_{idx}"
        chunks = split_and_normalize(audio_file, args.output_dir, prefix)
        all_chunks.extend(chunks)
        
    if all_chunks:
        create_jsonl_metadata(all_chunks, args.output_dir, args.artist_name, args.genre, args.bpm)
        logger.info(f"Dataset preparation complete! Data saved to {args.output_dir}")
        logger.info("This folder is now ready to be mounted to a PyTorch LoRA training container.")

if __name__ == "__main__":
    main()
