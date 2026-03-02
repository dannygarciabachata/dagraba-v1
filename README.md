# DA GRABA STUDIO - V1 Ecosystem 🌌

This repository contains the full source code for **DA GRABA STUDIO**, a premium AI-powered digital audio workstation and music production hub.

## Project Structure

- **`/frontend`**: The main user interface and DAW engine. Built with Next.js 14/15, Tailwind CSS, and Zustand. 
  - Includes the immersive Piano Roll, 32-channel Digital Mixer, and AI Engineering Console.
  - Features a specialized Admin Control Center for system-wide management.
- **`/backend`**: The Python/FastAPI service layer (likely for Modal or standalone processing) handling heavyweight audio DSP and AI model orchestration.

## Key Technologies

- **Frontend**: Next.js (App Router), TypeScript, Framer Motion, Web Audio API.
- **Styling**: Vanilla CSS + Tailwind CSS (Cyberpunk/Logic Pro X aesthetic).
- **Database**: Prisma ORM with PostgreSQL.
- **Real-time**: Convex (for live state synchronization).
- **AI Integration**: OpenAI, ElevenLabs, Modal.com for distributed audio tasks.

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
(See `/backend` for specific environment setup and dependency installation)

## Recent Updates
- **Admin Tabbed Navigation**: Refactored the administration panel into a high-performance tabbed interface integrated with the "Rack Central" sidebar.
- **SuperAdmin Security**: Implemented strict role-based access control for administrative routes and settings.
- **Suspense Integration**: Optimized build stability with React Suspense for query-parameter-based routing.

---
*Created and maintained with precision for Da Graba Music Studio.*
