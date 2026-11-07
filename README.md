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

## Current foundation (v0.4.0)

- Responsive workspace layout for mobile and desktop browsers.
- Narration-first composer that distributes a supplied script across storyboard scenes.
- Browser voice-over playback using the device's Indonesian text-to-speech voice where available.
- Procedural transition sound effects during preview and included in supported WebM exports.
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

This is the first application foundation, not yet a connected AI video-generation service. The storyboard builder currently uses local templates. No external AI provider, image/video generation API, or cloud-quality AI voice provider is connected. Browser voice-over playback uses the device's speech synthesis and is a preview; it is not yet mixed into the exported video. Procedural transition SFX are generated in-browser and included in supported WebM exports. The procedural canvas renderer produces animated graphics, not photorealistic AI video. MP4 rendering is not available. Do not enter API secrets into the browser; future provider credentials must be handled by a secure backend.

## Planned next milestones

1. Secure backend and provider adapter system for chat, image, and video models.
2. Reference upload and analysis pipeline for images, audio, video, and documents.
3. Expanded editable motion-graphics renderer, effects, and real-time preview.
4. Native Android, Windows, Linux, and iOS packaging with signed releases.
5. MP4 export pipeline, audio mixing, and multi-track timeline.
6. AI text-to-speech voice-over mixed into the final video, richer licensed SFX library, subtitles, and multi-track timeline.

## Stack

React, TypeScript, Vite, and Lucide icons.