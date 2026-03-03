import os
import logging
import uuid
import time
import subprocess
try:
    from pydub import AudioSegment
    from pydub.effects import normalize
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False

logger = logging.getLogger("Agent D: Mixer")
logger.setLevel(logging.INFO)

class AudioMixerAgent:
    """
    Agent D: Post-Production.
    Takes the final mixed audio (Instrumental + RVC Vocals), applies mastering
    (normalization, subtle compression/EQ), and exports the final MP3 for the frontend.
    """
    def __init__(self, export_dir="../frontend/public/exports"):
        self.export_dir = export_dir
        os.makedirs(self.export_dir, exist_ok=True)
        
    def _apply_mastering_pydub(self, input_wav: str, output_mp3: str):
        """
        Uses pydub to normalize and master the audio.
        """
        logger.info(f"Mastering audio using Pydub: {input_wav}")
        try:
            audio = AudioSegment.from_wav(input_wav)
            
            # 1. Normalize Audio
            mastered_audio = normalize(audio)
            
            # Note: Real mastering would include multiband compression, 
            # EQing the vocals into the mix, and limiting.
            # Pydub is basic, so normalization is the primary step here.
            
            # 2. Export to MP3 (High Quality, 320k)
            mastered_audio.export(output_mp3, format="mp3", bitrate="320k")
            logger.info(f"Successfully mastered and exported to: {output_mp3}")
            return True
        except Exception as e:
            logger.error(f"Pydub mastering failed: {e}")
            return False

    def _apply_mastering_ffmpeg(self, input_wav: str, output_mp3: str):
        """
        Fallback string-based mastering using FFmpeg CLI if pydub fails.
        Applies a basic limiter and loudnorm filter.
        """
        logger.info(f"Mastering audio using FFmpeg (Fallback): {input_wav}")
        try:
            cmd = [
                "ffmpeg", "-y",
                "-i", input_wav,
                "-af", "loudnorm=I=-14:LRA=11:TP=-1.5", # EBU R128 loudness normalization
                "-b:a", "320k",
                output_mp3
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            logger.info(f"Successfully mastered via FFmpeg to: {output_mp3}")
            return True
        except Exception as e:
            logger.error(f"FFmpeg mastering failed: {e}")
            return False

    def process(self, input_wav: str) -> str:
        """
        Main pipeline execution for Agent D.
        Returns the path to the final production-ready MP3.
        """
        logger.info(f"Agent D received track {input_wav} for final Mastering.")
        
        output_filename = f"mastered_{uuid.uuid4().hex[:8]}.mp3"
        final_mp3_path = os.path.join(self.export_dir, output_filename)
        
        success = False
        
        if PYDUB_AVAILABLE:
            success = self._apply_mastering_pydub(input_wav, final_mp3_path)
            
        if not success:
            success = self._apply_mastering_ffmpeg(input_wav, final_mp3_path)
            
        if not success:
            # Absolute fallback: just copy and rename the .wav to .mp3 (dangerous but ensures output)
            import shutil
            logger.warning("All mastering methods failed. Copying raw output.")
            shutil.copyfile(input_wav, final_mp3_path.replace(".mp3", ".wav"))
            return final_mp3_path.replace(".mp3", ".wav")
            
        return final_mp3_path
