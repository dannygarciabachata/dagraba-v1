#include <cmath>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vector>

/**
 * Professional DSP Processor Template for Da Graba Studio
 * This class handles real-time audio processing logic in C++ (WASM).
 */
class Processor {
public:
  Processor() : m_gain(1.0f) {}

  // Process a block of audio data
  void process(uintptr_t inputPtr, uintptr_t outputPtr, int numSamples,
               int numChannels) {
    float *input = reinterpret_cast<float *>(inputPtr);
    float *output = reinterpret_cast<float *>(outputPtr);

    for (int channel = 0; channel < numChannels; ++channel) {
      for (int i = 0; i < numSamples; ++i) {
        int index = channel * numSamples + i;
        output[index] = input[index] * m_gain;
      }
    }
  }

  void setGain(float gain) { m_gain = gain; }

  float getGain() const { return m_gain; }

private:
  float m_gain;
};

// Emscripten Binding for JavaScript interaction
using namespace emscripten;

EMSCRIPTEN_BINDINGS(Processor) {
  class_<Processor>("Processor")
      .constructor<>()
      .function("process", &Processor::process)
      .function("setGain", &Processor::setGain)
      .function("getGain", &Processor::getGain);
}
