/**
 * Da Graba Studio — Professional DSP Plugin Suite
 * ================================================
 * Three studio-grade audio processors compiled to WebAssembly:
 *   1. DG_Compressor  – Feed-forward compressor with RMS / Peak detection
 *   2. DG_Saturator   – Tube-style asymmetric waveshaper with mix blend
 *   3. DG_ParametricEQ – 4-band parametric equalizer (LS, 2×Peak, HS)
 *
 * Build:
 *   emcc -O3 dsp/src/DaGrabaDSP.cpp --bind  \
 *        -s WASM=1 -s ALLOW_MEMORY_GROWTH=1  \
 *        -s MODULARIZE=1 -s "EXPORT_NAME=createDaGrabaDSP" \
 *        -o public/wasm/dagraba-dsp.js
 */

#include <algorithm>
#include <cmath>
#include <emscripten/bind.h>
#include <vector>

static constexpr float PI_F = 3.14159265358979323846f;

// ─────────────────────────────────────────────────────────────────────────────
// 1. COMPRESSOR
// ─────────────────────────────────────────────────────────────────────────────
class DG_Compressor {
public:
  DG_Compressor()
      : m_threshold(-18.0f), m_ratio(4.0f), m_attackMs(10.0f),
        m_releaseMs(100.0f), m_makeupGain(0.0f), m_kneeWidth(6.0f),
        m_envDb(-96.0f), m_sampleRate(44100.0f) {}

  void setSampleRate(float sr) { m_sampleRate = sr; }

  void setThreshold(float dB) { m_threshold = dB; }
  void setRatio(float ratio) { m_ratio = std::max(1.0f, ratio); }
  void setAttack(float ms) { m_attackMs = std::max(0.01f, ms); }
  void setRelease(float ms) { m_releaseMs = std::max(1.0f, ms); }
  void setMakeupGain(float dB) { m_makeupGain = dB; }
  void setKneeWidth(float dB) { m_kneeWidth = std::max(0.0f, dB); }

  float getGainReduction() const { return m_lastGR; }

  /**
   * Process interleaved stereo samples in-place.
   * ptr points to float[numFrames * 2].
   */
  void process(uintptr_t ptr, int numFrames) {
    float *buf = reinterpret_cast<float *>(ptr);

    const float alphaA =
        expf(-logf(9.0f) / (m_attackMs * 0.001f * m_sampleRate));
    const float alphaR =
        expf(-logf(9.0f) / (m_releaseMs * 0.001f * m_sampleRate));
    const float makeupLin = powf(10.0f, m_makeupGain / 20.0f);

    for (int i = 0; i < numFrames; ++i) {
      float L = buf[i * 2];
      float R = buf[i * 2 + 1];

      // Peak detection (linked stereo)
      float peak = std::max(fabsf(L), fabsf(R));
      float peakDb = 20.0f * log10f(std::max(peak, 1e-12f));

      // Smooth envelope (log domain)
      float alpha = (peakDb > m_envDb) ? alphaA : alphaR;
      m_envDb = alpha * m_envDb + (1.0f - alpha) * peakDb;

      // Gain computer with soft knee
      float overDb = m_envDb - m_threshold;
      float grDb = 0.0f;

      if (m_kneeWidth > 0.0f && fabsf(overDb) < m_kneeWidth * 0.5f) {
        // Inside knee region
        float x = overDb + m_kneeWidth * 0.5f;
        grDb = (1.0f / m_ratio - 1.0f) * x * x / (2.0f * m_kneeWidth);
      } else if (overDb > 0.0f) {
        grDb = overDb * (1.0f / m_ratio - 1.0f);
      }

      float grLin = powf(10.0f, grDb / 20.0f) * makeupLin;
      m_lastGR = grDb;

      buf[i * 2] = L * grLin;
      buf[i * 2 + 1] = R * grLin;
    }
  }

private:
  float m_threshold, m_ratio, m_attackMs, m_releaseMs;
  float m_makeupGain, m_kneeWidth;
  float m_envDb, m_sampleRate;
  float m_lastGR = 0.0f;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. TUBE SATURATOR
// ─────────────────────────────────────────────────────────────────────────────
class DG_Saturator {
public:
  DG_Saturator()
      : m_drive(1.0f), m_mix(1.0f), m_outputGain(1.0f), m_bias(0.1f) {}

  void setDrive(float d) { m_drive = std::max(0.1f, d); }
  void setMix(float m) { m_mix = std::clamp(m, 0.0f, 1.0f); }
  void setOutputGain(float g) { m_outputGain = g; }
  void setBias(float b) { m_bias = b; }

  /**
   * Process interleaved stereo samples in-place.
   * Asymmetric waveshaper emulating tube saturation.
   */
  void process(uintptr_t ptr, int numFrames) {
    float *buf = reinterpret_cast<float *>(ptr);

    for (int i = 0; i < numFrames * 2; ++i) {
      float dry = buf[i];
      float x = dry * m_drive;

      // Asymmetric tube model
      // Positive half: soft clip (tanh)
      // Negative half: harder clip with bias
      float wet;
      if (x >= 0.0f) {
        wet = tanhf(x);
      } else {
        float biased = x - m_bias;
        wet = tanhf(biased * 1.3f) + m_bias * 0.3f;
      }

      // 2nd harmonic injection (subtle even harmonics like real tubes)
      wet += 0.05f * sinf(2.0f * PI_F * x) * m_drive * 0.2f;

      buf[i] = (m_mix * wet + (1.0f - m_mix) * dry) * m_outputGain;
    }
  }

private:
  float m_drive, m_mix, m_outputGain, m_bias;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PARAMETRIC EQ (4 bands)
// ─────────────────────────────────────────────────────────────────────────────

struct BiquadState {
  float x1 = 0, x2 = 0, y1 = 0, y2 = 0; // Per-channel history
};

struct BiquadCoeffs {
  float b0 = 1, b1 = 0, b2 = 0, a1 = 0, a2 = 0;
};

class DG_ParametricEQ {
public:
  DG_ParametricEQ() : m_sampleRate(44100.0f) {
    // 4 bands, 2 channels each
    m_stateL.resize(4);
    m_stateR.resize(4);
    m_coeffs.resize(4);

    // Default: flat response
    setBand(0, 80.0f, 0.0f, 0.7f, 0);   // Low Shelf
    setBand(1, 800.0f, 0.0f, 1.0f, 1);  // Peak
    setBand(2, 3500.0f, 0.0f, 1.0f, 1); // Peak
    setBand(3, 8000.0f, 0.0f, 0.7f, 2); // High Shelf
  }

  void setSampleRate(float sr) { m_sampleRate = sr; }

  /**
   * Configure a band.
   * type: 0 = lowShelf, 1 = peaking, 2 = highShelf
   */
  void setBand(int band, float freq, float gainDb, float Q, int type) {
    if (band < 0 || band >= 4)
      return;

    float A = powf(10.0f, gainDb / 40.0f);
    float w0 = 2.0f * PI_F * freq / m_sampleRate;
    float sinW = sinf(w0);
    float cosW = cosf(w0);
    float alpha = sinW / (2.0f * Q);

    BiquadCoeffs &c = m_coeffs[band];
    float a0;

    if (type == 0) { // Low Shelf
      float sqrtA = sqrtf(A);
      a0 = (A + 1.0f) + (A - 1.0f) * cosW + 2.0f * sqrtA * alpha;
      c.b0 = A * ((A + 1.0f) - (A - 1.0f) * cosW + 2.0f * sqrtA * alpha);
      c.b1 = 2.0f * A * ((A - 1.0f) - (A + 1.0f) * cosW);
      c.b2 = A * ((A + 1.0f) - (A - 1.0f) * cosW - 2.0f * sqrtA * alpha);
      c.a1 = -2.0f * ((A - 1.0f) + (A + 1.0f) * cosW);
      c.a2 = (A + 1.0f) + (A - 1.0f) * cosW - 2.0f * sqrtA * alpha;
    } else if (type == 2) { // High Shelf
      float sqrtA = sqrtf(A);
      a0 = (A + 1.0f) - (A - 1.0f) * cosW + 2.0f * sqrtA * alpha;
      c.b0 = A * ((A + 1.0f) + (A - 1.0f) * cosW + 2.0f * sqrtA * alpha);
      c.b1 = -2.0f * A * ((A - 1.0f) + (A + 1.0f) * cosW);
      c.b2 = A * ((A + 1.0f) + (A - 1.0f) * cosW - 2.0f * sqrtA * alpha);
      c.a1 = 2.0f * ((A - 1.0f) - (A + 1.0f) * cosW);
      c.a2 = (A + 1.0f) - (A - 1.0f) * cosW - 2.0f * sqrtA * alpha;
    } else { // Peaking
      a0 = 1.0f + alpha / A;
      c.b0 = 1.0f + alpha * A;
      c.b1 = -2.0f * cosW;
      c.b2 = 1.0f - alpha * A;
      c.a1 = -2.0f * cosW;
      c.a2 = 1.0f - alpha / A;
    }

    // Normalize
    c.b0 /= a0;
    c.b1 /= a0;
    c.b2 /= a0;
    c.a1 /= a0;
    c.a2 /= a0;
  }

  /**
   * Process interleaved stereo in-place.
   */
  void process(uintptr_t ptr, int numFrames) {
    float *buf = reinterpret_cast<float *>(ptr);

    for (int i = 0; i < numFrames; ++i) {
      float L = buf[i * 2];
      float R = buf[i * 2 + 1];

      for (int b = 0; b < 4; ++b) {
        L = processBiquad(L, m_coeffs[b], m_stateL[b]);
        R = processBiquad(R, m_coeffs[b], m_stateR[b]);
      }

      buf[i * 2] = L;
      buf[i * 2 + 1] = R;
    }
  }

private:
  float processBiquad(float x, const BiquadCoeffs &c, BiquadState &s) {
    float y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
    s.x2 = s.x1;
    s.x1 = x;
    s.y2 = s.y1;
    s.y1 = y;
    return y;
  }

  float m_sampleRate;
  std::vector<BiquadState> m_stateL, m_stateR;
  std::vector<BiquadCoeffs> m_coeffs;
};

// ─────────────────────────────────────────────────────────────────────────────
// EMSCRIPTEN BINDINGS
// ─────────────────────────────────────────────────────────────────────────────
using namespace emscripten;

EMSCRIPTEN_BINDINGS(DaGrabaDSP) {
  class_<DG_Compressor>("DG_Compressor")
      .constructor<>()
      .function("setSampleRate", &DG_Compressor::setSampleRate)
      .function("setThreshold", &DG_Compressor::setThreshold)
      .function("setRatio", &DG_Compressor::setRatio)
      .function("setAttack", &DG_Compressor::setAttack)
      .function("setRelease", &DG_Compressor::setRelease)
      .function("setMakeupGain", &DG_Compressor::setMakeupGain)
      .function("setKneeWidth", &DG_Compressor::setKneeWidth)
      .function("getGainReduction", &DG_Compressor::getGainReduction)
      .function("process", &DG_Compressor::process);

  class_<DG_Saturator>("DG_Saturator")
      .constructor<>()
      .function("setDrive", &DG_Saturator::setDrive)
      .function("setMix", &DG_Saturator::setMix)
      .function("setOutputGain", &DG_Saturator::setOutputGain)
      .function("setBias", &DG_Saturator::setBias)
      .function("process", &DG_Saturator::process);

  class_<DG_ParametricEQ>("DG_ParametricEQ")
      .constructor<>()
      .function("setSampleRate", &DG_ParametricEQ::setSampleRate)
      .function("setBand", &DG_ParametricEQ::setBand)
      .function("process", &DG_ParametricEQ::process);
}
