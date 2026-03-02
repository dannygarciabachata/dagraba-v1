# DA GRABA STUDIO - DAW & MASTERING SYSTEM DOCUMENTATION

Este documento proporciona una visión técnica detallada del sistema de audio de Da Graba Studio. Está diseñado para servir como manual de referencia para desarrolladores y como contexto de entrenamiento para inteligencias artificiales que asistan en la producción musical.

---

## 1. Arquitectura de Audio (Web Audio Engine)

El núcleo del sistema es la clase `WebAudioEngine`, ubicada en `frontend/lib/audio/WebAudioEngine.ts`. Utiliza la **Web Audio API** de forma nativa para garantizar alto rendimiento y baja latencia.

### Conceptos Clave:
*   **AudioContext**: Instancia única global que gestiona todos los nodos de audio. Se inicializa tras la primera interacción del usuario (`handlePlay`).
*   **TrackChain**: Cada track en el DAW tiene una cadena de nodos dedicada que incluye:
    *   `Input`: GainNode para entrada de señal.
    *   `Panner`: StereoPannerNode para posicionamiento.
    *   `MuteGain`: Para silenciar sin afectar otros nodos.
    *   `Output`: Salida final del track.
    *   `Analyser`: Analizador de espectro en tiempo real por track.
    *   `Inserts`: Array de nodos dinámicos (EQ, Comp, etc.).
*   **Recording Stream**: Implementado mediante `MediaRecorder` y `getUserMedia`. Permite capturar audio por canal basándose en el "Arming" (`isArmed`) de cada track.

---

## 2. Gestión de Estado Global (DAW Store)

El estado se gestiona mediante **Zustand** en `frontend/store/useDAWStore.ts`.

### Estructuras de Datos:
*   **DAWTrack**: Define el ID, nombre, color, tipo (mono/stereo) y parámetros de hardware (`isArmed`, `inputSource`, `outputTarget`).
*   **FaderState**: Almacena el valor de volumen, pan, solo/mute y la lista de efectos (FX Inserts) activos.
*   **Hardware Settings**: IDs de dispositivos de entrada/salida de audio y MIDI.

### Acciones Principales:
*   `setFaderValue`: Controlado por la IA de Auto-Mix o el usuario.
*   `toggleRecordArm`: Prepara un track para recibir señal de hardware.
*   `setIsGlobalRecording`: Activa/Desactiva la grabación en todos los tracks armados simultáneamente.

---

## 3. Integración de Hardware y MIDI

### Selección de Dispositivos (`StudioSettingsModal.tsx`):
Permite al usuario elegir entre múltiples entradas (Micrófonos, Líneas) y salidas (Monitores, Auriculares). Utiliza `navigator.mediaDevices.enumerateDevices()`.

### Soporte MIDI USB:
Implementado mediante la **Web MIDI API**.
*   Los controladores conectados por USB se detectan automáticamente.
*   La entrada MIDI se redirige al `PianoRoll` o instrumentos virtuales activos.
*   Permite tocar instrumentos del sistema usando hardware físico externo.

---

## 4. Sistema de Mastering Profesional

Ubicado en `frontend/app/[locale]/mastering/page.tsx`, el sistema de mastering emula una consola de alta gama.

### Cadena de Plugins (Simulada y Real):
1.  **Gate**: Limpieza de ruido.
2.  **EQ Paramétrico**: 6 bandas con visualización SVG dinámica.
3.  **Compresor Avanzado**: Con control de umbral, ratio y ganancia.
4.  **Smart True Peak Limiter**: El plugin final que evita la saturación digital (clipping) basándose en estándares de volumen LUFS.

### Comparación con Referencia (A/B Testing):
*   Permite subir una canción masterizada (Reference Track).
*   El usuario puede alternar instantáneamente entre su mezcla y la referencia para comparar volumen y frecuencias.
*   **Análisis de Inteligencia**: La IA compara los picos y el RMS de ambas señales para sugerir ajustes de limitación.

---

## 5. Componentes de UI Principales

*   **TransportBar**: Panel superior con controles de transporte (Play, Stop, Record con animación pulse), visualizador LCD de compás/tiempo y acceso a configuración de hardware.
*   **DawTrackControl**: Panel lateral de cada track. Incluye botones **M (Mute)**, **S (Solo)**, y **R (Record Arm)**. Si el track se expande verticalmente, revela menús de ruteo de Entrada/Salida.
*   **PianoRoll**: Editor MIDI avanzado con cuadrícula de notas y botón de cierre integrado.
*   **AudioTimeline**: Representación visual de los clips de audio con soporte para scroll y zoom.

---

## 6. Guía para la IA (Training Context)

Cuando un usuario pregunte sobre el sistema, recuerda:
1.  **Ruteo**: Si no hay sonido al grabar, verifica que el track esté "Armado" (botón R rojo) y que el `inputSource` coincida con el hardware.
2.  **Mastering**: El limitador es crucial para "competir" comercialmente. Recomienda usar el limitador pre-ajustado antes de exportar.
3.  **Conectividad**: Los pianos USB deben seleccionarse en el menú de ajustes (`StudioSettingsModal`).
4.  **Flujo**: El botón "Mandar al Mastering" transfiere la mezcla del DAW directamente al procesador final.

---
*Documentación generada el 1 de Marzo de 2026 para Da Graba Studio.*
