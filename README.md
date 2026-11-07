# Motion Graphics Generator

A responsive creative workspace foundation for planning motion-graphics videos.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Current foundation (v0.3.0)

- Responsive workspace layout for mobile and desktop browsers.
- Prompt composer and local four-scene storyboard draft generator.
- Editable scene descriptions, narration, camera direction, lighting, subtitles, SFX, and duration.
- Scene selection and proportional timeline overview.
- Procedural 720 × 1280 canvas renderer with animated planets, particles, glow, title, and subtitle.
- Browser playback controls and WebM recording/export at 30 FPS where MediaRecorder is supported.
- Local project persistence using browser storage.
- Export of editable project data as JSON.
- Installable Progressive Web App (PWA) shell with web manifest and service worker.
- Cross-platform download center page for web, Android, Windows, Linux, and iOS.
- GitHub Pages deployment workflow for publishing the web app.

## Important limitations

This is the first application foundation, not yet a connected AI video-generation service. The storyboard builder currently uses local templates. No external AI provider, image/video generation API, audio synthesis, or MP4 rendering engine is connected. The procedural canvas renderer produces animated graphics and can record them to a WebM video in supported browsers. This is not photorealistic AI video generation. Do not enter API secrets into the browser; future provider credentials must be handled by a secure backend.

## Planned next milestones

1. Secure backend and provider adapter system for chat, image, and video models.
2. Reference upload and analysis pipeline for images, audio, video, and documents.
3. Expanded editable motion-graphics renderer, effects, and real-time preview.
4. Native Android, Windows, Linux, and iOS packaging with signed releases.
5. MP4 export pipeline, audio mixing, and multi-track timeline.
6. Audio, narration, subtitles, and multi-track timeline.

## Stack

React, TypeScript, Vite, and Lucide icons.