# DA GRABA STUDIO V1 🎧
**Immersive Audio Engineering Console & AI Production Hub**

## Overview
DA GRABA STUDIO V1 is a premium, professional-grade digital audio workstation (DAW) and AI-powered music production platform. Designed for high-end audio engineering, it combines a sleek "Logic Pro X" inspired aesthetic with powerful AI features like vocal cloning, automated mixing, and generative track creation.

---

## Core Features

### 🎚️ Full Digital Console (Mixing Desk)
- **32-Channel Mixer**: Professional 32-channel layout with bank switching (CH 1-16 / 17-32).
- **Per-Track Digital Strip**:
  - **Live Spectrum Analyzer**: Real-time frequency monitoring on every channel (active only during playback).
  - **Advanced VU Metering**: Hardware-style LED meters for precise clipping detection.
  - **FX Slots**: Dedicated digital buttons for EQ, Compression, Delay, and Reverb.
- **Full Console Mode**: A dedicated "MIX" workspace that hide the timeline for an immersive mixing experience.

### 🎹 Workspace & Editing
- **Professional Piano Roll**: Logic Pro X-inspired MIDI editor with velocity-colored notes, toolbar, and snap-to-grid.
- **Interactive Audio Timeline**: Multi-track visualization with high-precision playhead.
- **Studio Monitors**: Visual monitors that animate in real-time based on audio amplitude.

### 🤖 AI Engineering & Creation
- **Ingeniero John (AI Engineer)**: An integrated AI assistant for project management, lyric suggestions, and automated tasks.
- **Modal Engine Integration**: Direct connection to Modal's cloud for heavyweight AI tasks (Voice Cloning, Training).
- **Crear (Suno-Style)**: A generative interface for creating full tracks from simple prompts, including vertical track listing and detailed song views.

### ☁️ Cloud & Admin
- **Cloud Status Panel**: Integrated sidebar status for "Modal Engine" connectivity.
- **Financial Vault**: Revenue tracking and financial metrics for admins.
- **Asset Manager**: Centralized management for WAVs, MIDIs, and trained AI models.

---

## Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Framer Motion (Animations).
- **State Management**: Zustand (Global DAW Store).
- **Audio Engine**: Web Audio API with custom `AnalyserNode` bridges and real-time visualization.
- **Database**: PostgreSQL with Prisma ORM (Neon.tech / Supabase).
- **AI Backend**: OpenAI GPT-4o, Modal.com (Python), ElevenLabs (TTS).

---

## Directory Structure
- `/app`: Next.js pages and API routes.
- `/components`: Modular UI and DAW-specific components.
  - `/daw`: Piano Roll, Fader, Mixer, Timeline, TransportBar.
  - `/ui`: Global layout components (Sidebar, Buttons, Cards).
- `/store`: Zustand state definitions (`useDAWStore.ts`).
- `/lib`: Utility functions, constants, and API clients.
- `/prisma`: Database schema and migrations.

---

## Development
```bash
# Clone the repository
git clone [repo-url]

# Install dependencies
npm install

# Run the development server
npm run dev
```

## Documentation & Memory
Detailed walkthroughs and implementation plans are maintained in the `.gemini/antigravity/brain` directory for persistent context and development history.
