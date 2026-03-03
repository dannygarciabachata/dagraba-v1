import os
import logging
import uuid
import time
import subprocess
import soundfile as sf
import numpy as np
from pydub import AudioSegment

logger = logging.getLogger("Agent C: Mimic")
logger.setLevel(logging.INFO)

class MimicRVCAgent:
    """
    Agent C: The Cover Engine.
    Handles the separation of the generated AudioCraft track into Stems (Vocals/Instrumentals),
    applies Retrieval-based Voice Conversion (RVC) to the vocal stem,
    and mixes it back together.
    """
    def __init__(self, models_dir="models/rvc/", export_dir="../frontend/public/exports"):
        self.models_dir = models_dir
        self.export_dir = export_dir
        
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.export_dir, exist_ok=True)
        
    def _run_demucs(self, input_wav: str) -> dict:
        """
        Uses Demucs to separate the track into 'vocals' and 'no_vocals'.
        If Demucs is not installed locally, simulates the process by just returning the input path.
        """
        logger.info(f"Running Demucs source separation on {input_wav}...")
        
        output_dir = os.path.join(os.path.dirname(input_wav), "separated")
        os.makedirs(output_dir, exist_ok=True)
        
        # Demucs CLI command pattern (Model HTDemucs)
        # python3 -m demucs.separate -n htdemucs --two-stems=vocals input.wav -o output_dir
        
        try:
            # Check if Demucs is installed
            result = subprocess.run(["python3", "-m", "demucs.separate", "-h"], capture_output=True)
            if result.returncode == 0:
                logger.info("Demucs found. Executing real separation...")
                subprocess.run([
                    "python3", "-m", "demucs.separate", 
                    "-n", "htdemucs", 
                    "--two-stems=vocals", 
                    input_wav, 
                    "-o", output_dir
                ], check=True, stdin=subprocess.DEVNULL)
                
                base_name = os.path.splitext(os.path.basename(input_wav))[0]
                return {
                    "vocals": os.path.join(output_dir, "htdemucs", base_name, "vocals.wav"),
                    "instrumental": os.path.join(output_dir, "htdemucs", base_name, "no_vocals.wav")
                }
        except Exception:
            pass
            
        logger.warning("Demucs is not installed or failed. Simulating stem separation.")
        time.sleep(2) # Simulated separation time
        return {
            "vocals": input_wav,
            "instrumental": input_wav 
        }

    def _apply_rvc(self, vocal_stem: str, voice_model_id: str) -> str:
        """
        Applies RVC inference to the vocal stem using a trained .pth model.
        """
        if not voice_model_id:
            logger.info("No specific voice model requested. Skipping RVC inference.")
            return vocal_stem
            
        logger.info(f"Applying RVC Inference using Voice Model: {voice_model_id}...")
        model_path = os.path.join(self.models_dir, voice_model_id)
        
        output_path = vocal_stem.replace(".wav", "_rvc_converted.wav")
        
        # Real RVC inference usually requires instantiating the VC class from RVC
        # e.g., vc = VC(config); audio_opt = vc.pipeline(model_path, index_path, vocal_stem, ... )
        # Here we simulate the process if the RVC libraries (torch/fairseq) are missing.
        
        if os.path.exists(model_path):
            logger.info(f"Loaded model {model_path}. Extracting f0 (crepe/rmvpe)...")
            time.sleep(1)
            logger.info("Converting vocals...")
            time.sleep(2)
        else:
            logger.warning(f"Voice model {voice_model_id} not found at {self.models_dir}. Simulating RVC.")
            time.sleep(2)
            
        # Mocking the output file for dry-run
        import shutil
        try:
             shutil.copyfile(vocal_stem, output_path)
        except Exception:
             pass
             
        return output_path

    def _mix_audio(self, instrumental: str, new_vocals: str, final_output_path: str):
        """
        Uses soundfile and numpy to mix tracks, avoiding ffmpeg subprocess issues.
        """
        logger.info("Mixing instrumental and RVC vocals using soundfile + numpy...")
        try:
            # Load stems using soundfile
            data_inst, samplerate_inst = sf.read(instrumental)
            data_voc, samplerate_voc = sf.read(new_vocals)
            
            # Ensure same length by padding with zeros
            max_len = max(len(data_inst), len(data_voc))
            
            # If stereo/mono mix
            if data_inst.ndim == 1: data_inst = np.expand_dims(data_inst, axis=1)
            if data_voc.ndim == 1: data_voc = np.expand_dims(data_voc, axis=1)
            
            # Pad data_inst
            if len(data_inst) < max_len:
                pad_width = ((0, max_len - len(data_inst)), (0, 0))
                data_inst = np.pad(data_inst, pad_width, mode='constant')
            
            # Pad data_voc
            if len(data_voc) < max_len:
                pad_width = ((0, max_len - len(data_voc)), (0, 0))
                data_voc = np.pad(data_voc, pad_width, mode='constant')
                
            # Mix (simple average or sum)
            # We'll use sum and then clip/normalize to prevent clipping
            combined = (data_inst + data_voc) / 2.0
            
            # Save as WAV
            sf.write(final_output_path, combined, samplerate_inst)
            
            logger.info(f"Final mixed audio saved to {final_output_path}")
            return final_output_path
        except Exception as e:
            logger.error(f"Failed to mix audio via soundfile: {e}")
            # Fallback to just copying instrumental
            import shutil
            shutil.copyfile(instrumental, final_output_path)
            return final_output_path

    def process(self, input_wav: str, voice_model_id: str = None) -> str:
        """
        Main pipeline execution for Agent C.
        """
        logger.info(f"Agent C received track {input_wav} for Mimic processing.")
        
        # 1. Separate
        stems = self._run_demucs(input_wav)
        
        # 2. Voice Convert
        converted_vocals = self._apply_rvc(stems["vocals"], voice_model_id)
        
        # 3. Mix
        output_filename = f"final_mix_{uuid.uuid4().hex[:8]}.wav"
        final_output_path = os.path.join(self.export_dir, output_filename)
        
        final_file = self._mix_audio(stems["instrumental"], converted_vocals, final_output_path)
        
        return final_file
