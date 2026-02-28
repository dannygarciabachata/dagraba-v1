#!/bin/bash
# ──────────────────────────────────────────────────
# Da Graba Studio — DSP WASM Build Script
# ──────────────────────────────────────────────────
# Usage: bash scripts/build_dsp.sh
#
# Compiles C++ DSP processors to WebAssembly:
#   - DG_Compressor (feed-forward, soft knee)
#   - DG_Saturator  (tube-style waveshaper)
#   - DG_ParametricEQ (4-band biquad)

set -e

echo "🔧 Building Da Graba DSP Suite..."

mkdir -p public/wasm

emcc -O3 dsp/src/DaGrabaDSP.cpp \
    --bind \
    -s WASM=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s "EXPORT_NAME=createDaGrabaDSP" \
    -o public/wasm/dagraba-dsp.js

echo "✅ Compilation complete!"
echo "   → public/wasm/dagraba-dsp.js"
echo "   → public/wasm/dagraba-dsp.wasm"
ls -lh public/wasm/dagraba-dsp.*
