import os
import time
import logging
from engine.music_gen import MusicGenAgent
from engine.mimic_rvc import MimicRVCAgent
from engine.mixer import AudioMixerAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HeartMuLaMusicGenerator:
    """
    Core AI Generation class for Da Graba Studio.
    This structure is designed to load and execute HeartMuLa/Suno style 
    local inference using the trained user 'ADN'.
    """
    def __init__(self, use_gpu: bool = True):
        self.use_gpu = use_gpu
        self.is_loaded = False
        
        # Paths
        self.base_dir = os.path.dirname(__file__)
        self.logic_path = os.path.join(self.base_dir, "logic", "styles.json")
        self.export_dir = os.path.abspath(os.path.join(self.base_dir, '..', '..', 'frontend', 'public', 'exports'))
        self.rvc_models_dir = os.path.abspath(os.path.join(self.base_dir, 'models', 'rvc'))
        
        # Persistent Agents (preventing reload on every request)
        self.composer = MusicGenAgent(logic_path=self.logic_path, export_dir=self.export_dir)
        self.mimic = MimicRVCAgent(models_dir=self.rvc_models_dir, export_dir=self.export_dir)
        self.mixer = AudioMixerAgent(export_dir=self.export_dir)
        
    def load_base_model(self):
        """Loads the base foundation models into VRAM (MPS)"""
        logger.info("Initializing base HeartMuLa components...")
        # Pre-warm the MusicGen model (MusicGen-small)
        # This reduces the latency of the first inference request significantly.
        success = self.composer._init_transformers()
        if success:
            self.is_loaded = True
            logger.info("AI Foundations (MusicGen) loaded into memory.")
        else:
            logger.error("Failed to load AI foundations. Check engine logs.")

    def load_dna_weights(self, dna_id: str):
        """Loads the user's specific trained DNA / LoRA / Custom embeddings"""
        logger.info(f"Loading custom DNA weights for: {dna_id}")
        # Placeholder for actual PyTorch layer adaptation
        return True

    async def generate_orchestra(self, 
                                track_name: str, 
                                genre: str, 
                                pdf_data: str = None, 
                                audio_reference_data: str = None,
                                reference_type: str = "pdf",
                                commands: list = [],
                                creative_instruction: str = None):
        """
        Orquesta un track usando Modal. Soporta PDF (OMR) y Audio (Pitch Tracking).
        """
        try:
            from modal_orchestra import process_track_orchestra
            
            # Enviar a Modal Cloud
            # request = { ... } se maneja por el modelo ProcessTrackRequest en modal_orchestra
            result = await process_track_orchestra.remote.aio(
                track_name=track_name,
                genre=genre,
                pdf_data=pdf_data,
                audio_reference_data=audio_reference_data,
                reference_type=reference_type,
                commands=commands,
                creative_instruction=creative_instruction
            )
            return result
        except Exception as e:
            print(f"Error en orquestación remota: {e}")
            # Fallback simple
            return {
                "status": "error",
                "message": str(e),
                "job_id": "error_fallback",
                "output_url": None
            }
            
    def generate(self, prompt: str, dna_id: str = None, genre: str = "acoustic"):
        """
        Executes the inference pass using persisted agents.
        """
        logger.info(f"Starting generation pass. Prompt: '{prompt}', Style Key: {genre}")
        
        if not self.is_loaded:
            self.load_base_model()
            
        # 1. Map UI genres to internal style keys
        style_key = genre
        if genre.lower() == "bolero": style_key = "bolero_clasico"
        if genre.lower() == "reggaeton": style_key = "reggaeton_futurista"
        if genre.lower() == "bachata": style_key = "bachata_moderna"
            
        # 2. Generate core track (Agent B)
        gen_result = self.composer.generate(prompt, style_key)
        
        # 3. Apply RVC Inference (Agent C)
        voice_model_id = gen_result.get("voice_target")
        final_mix_path = self.mimic.process(gen_result.get("file_path"), voice_model_id)
        
        # 4. Final Mastering (Agent D)
        mastered_audio_path = self.mixer.process(final_mix_path)
        
        final_filename = os.path.basename(mastered_audio_path)
        audio_url = f"/exports/{final_filename}"
        image_url = f"https://picsum.photos/seed/{style_key}/200/200"

        # Create standard lyrics matching the prompt
        lyrics = f"[Intro]\n(Musical fade in)\n\n[Verse 1]\nIdea: {prompt}\nSintiendo la música nacer,\nEn Da Graba, vuelvo a creer.\n\n[Chorus]\nADN de mi alma, sonido letal,\n{genre.capitalize()} profundo, magia real.\n\n[Outro]\n(Music fades out)"
        
        agent_tags = gen_result.get("tags", [])
        tags_str = ",".join(agent_tags + ["heartmula-7b-os"])

        return {
            "success": True,
            "status": "SUCCESS",
            "message": "Generation completed successfully",
            "audioUrl": audio_url,
            "imageUrl": image_url,
            "lyrics": lyrics,
            "title": f"{genre.capitalize()} AI: {prompt[:20]}...",
            "tags": tags_str
        }

        #     track_name, pdf_data, genre
        # )
        
        logger.info(f"Track '{track_name}' categorized as {material}. OMR data extracted.")

        return {
            "success": True,
            "track": track_name,
            "material": material,
            "adn_model": adn_model,
            "score_data": score_data,
            "message": f"Orchestral processing initiated for {track_name} ({material})"
        }
