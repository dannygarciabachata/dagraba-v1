import os
import time
import shutil
import datetime
import logging
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Try to import audio libraries, provide instructions if missing
try:
    import librosa
    import numpy as np
    import soundfile as sf
except ImportError:
    print("Error: Missing dependencies. Run: pip install librosa numpy soundfile watchdog pydub")
    exit(1)

# --- CONFIGURATION ---
HOT_FOLDER = "/Users/odgmusic/DAW_Exports_Auto"
FINAL_STEMS_ROOT = "/Users/odgmusic/DAW_Managed_Stems/Final_Stems"
BACKUPS_ROOT = "/Users/odgmusic/DAW_Managed_Stems/Backups"
METADATA_ROOT = "/Users/odgmusic/DAW_Managed_Stems/Metadata"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class StemManager:
    def __init__(self):
        os.makedirs(HOT_FOLDER, exist_ok=True)
        os.makedirs(FINAL_STEMS_ROOT, exist_ok=True)
        os.makedirs(BACKUPS_ROOT, exist_ok=True)
        os.makedirs(METADATA_ROOT, exist_ok=True)

    def analyze_audio(self, file_path):
        """Detect BPM and Key using Librosa"""
        logging.info(f"Analyzing {os.path.basename(file_path)}...")
        try:
            y, sr = librosa.load(file_path, sr=None)
            
            # BPM Detection
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            bpm = round(float(tempo))

            # Key Detection (Chromagram analysis)
            chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
            key_names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
            key_index = int(np.argmax(np.mean(chroma, axis=1)))
            detected_key = key_names[key_index]

            # Zero-point verification (check first 100ms for silence)
            first_100ms = y[:int(sr * 0.1)]
            is_zero_start = np.max(np.abs(first_100ms)) > 0.0001
            
            return {
                "bpm": bpm,
                "key": detected_key,
                "zero_start": is_zero_start,
                "duration": librosa.get_duration(y=y, sr=sr)
            }
        except Exception as e:
            logging.error(f"Analysis failed: {e}")
            return None

    def process_folder(self, folder_path):
        """Process a newly exported folder of stems"""
        project_name = os.path.basename(folder_path)
        date_str = datetime.datetime.now().strftime("%Y%m%d")
        
        logging.info(f"Processing project: {project_name}")
        
        # 1. Backup original export
        backup_path = os.path.join(BACKUPS_ROOT, f"{date_str}_{project_name}_RAW")
        if not os.path.exists(backup_path):
            shutil.copytree(folder_path, backup_path)
            logging.info(f"Backup created at {backup_path}")

        # 2. Create target structure
        project_stems_dir = os.path.join(FINAL_STEMS_ROOT, f"{date_str}_{project_name}")
        os.makedirs(project_stems_dir, exist_ok=True)

        metadata_content = []
        overall_stats = {"bpm": 0, "key": "Unknown"}

        # 3. Process files
        for filename in os.listdir(folder_path):
            if not filename.lower().endswith(('.wav', '.aif', '.mp3')):
                continue
                
            input_path = os.path.join(folder_path, filename)
            
            # Simple instrument detection based on name
            inst = "OTHER"
            name_lower = filename.lower()
            if "voc" in name_lower: inst = "VOCAL"
            elif "kick" in name_lower or "drum" in name_lower or "beat" in name_lower: inst = "BEAT"
            elif "bass" in name_lower or "bajo" in name_lower: inst = "BASS"
            elif "mel" in name_lower or "syn" in name_lower or "piano" in name_lower: inst = "MELODY"
            
            stats = self.analyze_audio(input_path)
            if stats:
                overall_stats["bpm"] = stats["bpm"]
                overall_stats["key"] = stats["key"]
                
                status_msg = "[OK]" if stats["zero_start"] else "[WARN: NO ZERO START]"
                metadata_content.append(f"{inst}: {filename} | BPM: {stats['bpm']} | Key: {stats['key']} | {status_msg}")

            # Rename pattern: [DATE][PROJECT][INSTRUMENT]
            new_filename = f"{date_str}_{project_name}_{inst}.wav"
            output_path = os.path.join(project_stems_dir, new_filename)
            
            shutil.copy2(input_path, output_path)
            logging.info(f"Deployed: {new_filename}")

        # 4. Generate Metadata file
        meta_file_path = os.path.join(METADATA_ROOT, f"{date_str}_{project_name}_INFO.txt")
        with open(meta_file_path, "w") as f:
            f.write(f"PROJECT: {project_name}\n")
            f.write(f"DATE: {date_str}\n")
            f.write(f"DETECTED BPM: {overall_stats['bpm']}\n")
            f.write(f"DETECTED KEY: {overall_stats['key']}\n")
            f.write("-" * 30 + "\n")
            f.write("\n".join(metadata_content))
        
        logging.info(f"Metadata generated at {meta_file_path}")
        logging.info(f"FINISH: {project_name} successfully managed.")

class HotFolderHandler(FileSystemEventHandler):
    def __init__(self, manager):
        self.manager = manager

    def on_created(self, event):
        if event.is_directory:
            # Wait a few seconds for export to finish
            logging.info(f"New folder detected: {event.src_path}. Waiting for DAW export to finish...")
            time.sleep(10) 
            self.manager.process_folder(event.src_path)

if __name__ == "__main__":
    manager = StemManager()
    event_handler = HotFolderHandler(manager)
    observer = Observer()
    observer.schedule(event_handler, HOT_FOLDER, recursive=False)
    
    logging.info(f"WATCHER ACTIVE: Monitoring {HOT_FOLDER}...")
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
