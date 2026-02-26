# 🧠 MEMORIA DEL PROYECTO: DA GRABA STUDIO V1
Este documento sirve como la memoria central y técnica del proyecto, capturando la visión, las decisiones de diseño y la arquitectura del sistema.

---

## 🌟 La Visión: "El Consola del Futuro"
DA GRABA STUDIO no es solo un DAW; es un ecosistema de ingeniería inmersiva. La meta fue crear una herramienta que se sintiera como hardware de gama alta (inspirado en consolas SSL y Neve) pero con el poder de la IA moderna (OpenAI, Modal, Kie.ai).

### Pilares de Diseño:
1.  **Estética Logic Pro X**: Colores oscuros, acentos metálicos, y un flujo de trabajo profesional.
2.  **Transparencia de Datos**: Visualización en tiempo real (Spectrum, VU Meters) para que el ingeniero "vea" lo que escucha.
3.  **Fusión Humano-IA**: "Ingeniero John" actúa como un socio de producción, no solo como una herramienta.

---

## 🏗️ Arquitectura del Sistema

### 1. El Cerebro (Zustand Global Store)
Ubicado en `store/useDAWStore.ts`, este es el corazón del proyecto. Gestiona:
-   **Estados de Mezcla**: Volumen, Pan, Solo, Mute de 32 canales.
-   **Integración de IA**: Estatus de conexión con Modal, mensajes del sistema y progreso de entrenamiento.
-   **Navegación**: Cambio entre modo "MIX" (Consola Completa) y "EDIT" (Timeline).

### 2. La Consola Digital (`/studio`)
Componentes críticos que emulan hardware real:
-   **`Fader.tsx`**: Implementa una física de movimiento suave, medidores VU segmentados y ahora un mini-analizador de espectro por cada canal.
-   **`SpectrumAnalyzer.tsx`**: Un motor de renderizado basado en Canvas que procesa frecuencias de audio. Está optimizado para no consumir recursos cuando no hay reproducción.
-   **`TransportBar.tsx`**: Centraliza el control de tiempo, tempo y navegación entre los universos de edición y mezcla.

### 3. El Generador Inteligente (`/crear`)
Inspirado en Suno AI y MusicGPT:
-   Proporciona un layout de dos paneles para visualización de tracks y detalles de la canción (Cover art, Letras).
-   Conexión directa con modelos de generación IA para pasar de una idea a stems en el Studio.

### 4. Admin Rack (`/admin`)
-   Un panel de control "estilo nave espacial" para Danny.
-   Gestión de activos, entrenamiento de nuevos modelos IA (Kie.ai) y monitoreo financiero.

---

## 🛠️ Tecnologías Clave
-   **Next.js 14 & Tailwind CSS v4**: Para una UI ultra-rápida y personalizable.
-   **Framer Motion**: Todas las transiciones de paneles y popups de estatus.
-   **Prisma & PostgreSQL**: Persistencia de usuarios, tracks y configuraciones.
-   **Web Audio API**: Para todo el procesamiento de señal y visualización en el navegador.

---

## 📜 Historial de Evolución Relevante
1.  **Fase 1**: Definición de la estética Dark Metal y creación de los faders base.
2.  **Fase 2**: Integración de Modal.com para el "Cerebro" en la nube.
3.  **Fase 3**: Rediseño de `/crear` a un estilo Suno moderno.
4.  **Fase 4**: Refinamiento "Logic Pro" del Piano Roll y Mixer.
5.  **Fase 5 (Actual)**: Transformación a **Consola Completa**. Los faders ganaron analísis espectral independiente y slots de FX digitales. La navegación se unificó en el Transport Bar para alternar entre MIX y EDIT.

---

## 🚀 Próximos Pasos
-   **Efectos Activos**: Implementar la lógica real para los botones EQ/COMP que abran interfaces de procesamiento.
-   **Clonación en Tiempo Real**: Optimizar el pipeline de ElevenLabs para menor latencia.
-   **Stem Separation Directa**: Botón en la consola para separar tracks de audio subidos por el usuario.

---
**Documento creado para Danny Garcia - DA GRABA STUDIO V1 - Febrero 2026**
