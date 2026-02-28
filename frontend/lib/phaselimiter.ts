// lib/phaselimiter.ts
// Loader for phaselimiter.wasm — compiled from ai-mastering/phaselimiter via Emscripten
let moduleInstance: PhaseLimiterModule | null = null;
let loadingPromise: Promise<PhaseLimiterModule> | null = null;

export interface PhaseLimiterModule {
  createLimiter: () => number;
  processLimiter: (handle: number, inputPtr: number, outputPtr: number, numSamples: number) => void;
  destroyLimiter: (handle: number) => void;
  /** Raw Emscripten Module for advanced use (e.g. heap access) */
  raw: any;
}

export async function loadPhaseLimiter(): Promise<PhaseLimiterModule> {
  if (moduleInstance) return moduleInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise<PhaseLimiterModule>((resolve, reject) => {
    // Inject the Emscripten glue script once
    if (!document.querySelector('script[data-phaselimiter]')) {
      const script = document.createElement('script');
      script.src = '/phaselimiter.js';
      script.dataset.phaselimiter = '1';
      script.onerror = () => reject(new Error('Failed to load phaselimiter.js'));
      document.head.appendChild(script);
    }

    const wait = () => {
      const M = (window as any).Module;
      if (M?.calledRun) {
        finish(M);
      } else if (M) {
        const prev = M.onRuntimeInitialized;
        M.onRuntimeInitialized = () => {
          if (prev) prev();
          finish(M);
        };
      } else {
        // Module not yet defined — poll until script loads
        setTimeout(wait, 50);
      }
    };

    const finish = (M: any) => {
      moduleInstance = {
        createLimiter:  M.cwrap('createLimiter',  'number', []),
        processLimiter: M.cwrap('processLimiter', null,     ['number', 'number', 'number', 'number']),
        destroyLimiter: M.cwrap('destroyLimiter', null,     ['number']),
        raw: M,
      };
      resolve(moduleInstance);
    };

    wait();
  });

  return loadingPromise;
}
