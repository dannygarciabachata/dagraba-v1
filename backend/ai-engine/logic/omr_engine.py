import json
import os
import pypdfum2 as pdfium
from music21 import converter, stream, note, chord, tempo, meter

class OMREngine:
    """
    Engine for extracting musical data from PDF scores and converting to JSON.
    Supports basic Optical Music Recognition (OMR) data structures.
    """

    def __init__(self):
        self.supported_extensions = ['.pdf', '.midi', '.xml', '.mxl']

    def process_score(self, file_path_or_bytes):
        """
        Main entry point for processing a score.
        """
        if isinstance(file_path_or_bytes, str):
            ext = os.path.splitext(file_path_or_bytes)[1].lower()
            if ext == '.pdf':
                return self._parse_pdf(file_path_or_bytes)
            else:
                return self._parse_digital_score(file_path_or_bytes)
        else:
            # Assume bytes are a PDF for Phase 1
            return self._parse_pdf(file_path_or_bytes)

    def _parse_pdf(self, pdf_input):
        """
        Extracts musical data from a PDF. 
        Note: True OMR from raw PDF requires computer vision.
        Phase 1 implements the data structure and metadata extraction.
        """
        print(f"Parsing PDF score via pypdfum2...")
        
        # Load PDF
        if isinstance(pdf_input, str):
            pdf = pdfium.PdfDocument(pdf_input)
        else:
            pdf = pdfium.PdfDocument(pdf_input)

        # Metadata extraction
        metadata = {
            "title": "Unrecognized Score",
            "pages": len(pdf),
            "format": "PDF-OMR"
        }

        # Placeholder for AI-based vision recognition
        # In Phase 2, this will call a vision model to detect staves/notes
        notes = self._simulate_note_extraction()

        return {
            "metadata": metadata,
            "tracks": notes,
            "tempo": 120,
            "time_signature": "4/4"
        }

    def _parse_digital_score(self, file_path):
        """
        Parses MIDI or MusicXML files using music21.
        """
        score = converter.parse(file_path)
        return self._music21_to_dict(score)

    def _simulate_note_extraction(self):
        """
        Simulates the output of a vision-based OMR model for Testing.
        """
        return [
            {
                "name": "Instrument 1",
                "notes": [
                    {"pitch": "E4", "duration": 0.5, "offset": 0.0},
                    {"pitch": "G4", "duration": 0.5, "offset": 0.5},
                    {"pitch": "B4", "duration": 1.0, "offset": 1.0},
                    {"pitch": "A4", "duration": 1.0, "offset": 2.0},
                ]
            }
        ]

    def _music21_to_dict(self, score_obj):
        """
        Converts a music21 stream into a structured dictionary.
        """
        data = {
            "metadata": {},
            "tracks": [],
            "tempo": 120,
            "time_signature": "4/4"
        }

        # Extract Tempo
        tm = score_obj.metronomeMarkBoundaries()
        if tm:
            data["tempo"] = tm[0][2].number

        # Extract Time Signature
        ts = score_obj.getTimeSignatures()[0]
        if ts:
            data["time_signature"] = ts.ratioString

        # Process Parts
        for part in score_obj.parts:
            track = {"name": part.partName or "Unknown", "notes": []}
            for el in part.flatten().notes:
                if isinstance(el, note.Note):
                    track["notes"].append({
                        "pitch": el.pitch.nameWithOctave,
                        "duration": float(el.duration.quarterLength),
                        "offset": float(el.offset)
                    })
                elif isinstance(el, chord.Chord):
                    # For chords, we take the root for now or expand
                    track["notes"].append({
                        "pitches": [p.nameWithOctave for p in el.pitches],
                        "duration": float(el.duration.quarterLength),
                        "offset": float(el.offset)
                    })
            data["tracks"].append(track)

        return data

    def save_as_json(self, data, output_path):
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Musical data saved to {output_path}")

if __name__ == "__main__":
    # Test stub
    engine = OMREngine()
    # data = engine.process_score("sample.mid")
    pass
