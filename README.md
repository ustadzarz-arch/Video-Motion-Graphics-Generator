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

## Current foundation (v0.1.0)

- Responsive workspace layout for mobile and desktop browsers.
- Prompt composer and local four-scene storyboard draft generator.
- Editable scene descriptions, narration, camera direction, lighting, subtitles, SFX, and duration.
- Scene selection and proportional timeline overview.
- Local project persistence using browser storage.
- Export of editable project data as JSON.

## Important limitations

This is the first application foundation, not yet a connected AI video-generation service. The storyboard builder currently uses local templates. No external AI provider, image/video generation API, audio synthesis, or MP4 rendering engine is connected. The preview is a visual composition mock preview, not a rendered video. Do not enter API secrets into the browser; future provider credentials must be handled by a secure backend.

## Planned next milestones

1. Secure backend and provider adapter system for chat, image, and video models.
2. Reference upload and analysis pipeline for images, audio, video, and documents.
3. Editable motion-graphics renderer and real-time preview.
4. Audio, narration, subtitles, and multi-track timeline.
5. MP4 export pipeline and native Android, iOS, and desktop packaging.

## Stack

React, TypeScript, Vite, and Lucide icons.