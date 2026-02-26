/**
 * Audio Analyzer Bridge
 * Helper functions to create and connect a Web Audio AnalyserNode to a source.
 */

export const createAnalyzer = (audioContext: AudioContext, source: AudioNode) => {
    const analyzer = audioContext.createAnalyser();

    // Set the FFT size (Fast Fourier Transform). 
    // Higher values provide more detailed frequency data but are slower to compute.
    // 256 is a good balance for a visualizer, giving 128 frequency bins to draw.
    analyzer.fftSize = 256;

    // Connect the source to the analyzer
    source.connect(analyzer);

    return analyzer;
};
