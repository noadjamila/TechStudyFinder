# TechStudyFinder - Frontend (Vite)

This directory (client) contains the code for the TechStudyFinder Single
Page Application (SPA), developed using React/TypeScript and bundled
with Vite.

## Technologies

- **Framework:** React
- **Language:** TypeScript
- **Bundler/Dev Server:** Vite
- **Testing:** Vitest (with JSDOM environment)
- **Styling/UI:** Material UI (MUI) and Emotion
- **PWA:** Vite PWA Plugin is used for service worker and manifest
  generation.

## Available Scripts

All commands are executed from the project root directory (Monorepo)
using:\
`npm run <script> --workspace=client`

Starts the Vite development server:\
`npm run dev --workspace=client`

Accessible at: http://localhost:3000/

**Note on Proxy:**\
All API requests routed to `/api` are forwarded to the backend at
http://localhost:5001.

Creates a production build inside the `dist/` directory:\
`npm run build --workspace=client`

Locally previews the production build after running the build script:\
`npm run preview --workspace=client`

Runs unit tests using Vitest:\
`npm run test --workspace=client`

Formats the code using Prettier:\
`npm run format --workspace=client`

## Monorepo Integration

The frontend build (`dist/`) is served by the backend server.

**Important for Deployment:**\
Run the build script before restarting the entire project on the VPS to
ensure the newest static assets are served.
