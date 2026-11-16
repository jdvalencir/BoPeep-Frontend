# BoPeep-Frontend

BoPeep-Frontend is the web frontend of the Marcianos Operator platform. It lets users sign in, upload their personal files, view and download them, authenticate or delete documents, and transfer their account to another operator. The app is a Next.js application that talks to a backend API through its own server-side route handlers.

## Features

- Login and registration pages, with a Next.js middleware (`src/middleware.js`) guarding routes.
- File upload, document listing, preview (signed URLs) and download.
- Document authentication and deletion.
- Transfer of the user to another operator, chosen from a list fetched from the backend.
- Current user information shown in the header and sidebar.
- Form validation with react-hook-form and zod.

All backend calls go through route handlers in `src/app/api/` (`authenticate`, `delete`, `documents`, `download`, `operators`, `preview`, `transfer`, `upload`, `user`), which forward requests to the Marcianos API.

## Tech stack

- Next.js 15 (App Router, standalone output), React 19
- Tailwind CSS 4, Radix UI primitives, shadcn/ui-style components, lucide-react
- react-hook-form, zod, axios, js-cookie
- Docker, Kubernetes manifests, GitHub Actions (build, push to Docker Hub, deploy to GKE)

## Project structure

```
src/
  app/
    api/        Route handlers that proxy the backend API
    auth/       Login and register pages
    home/       Main file view and transfer page
  components/   Header, sidebar, upload, file card, UI components
  hooks/, lib/  Helpers
  middleware.js
k8s/            Deployment and Service manifests
Dockerfile
.github/workflows/docker-publish.yaml
```

## Getting started

Requires Node.js (the Dockerfile uses Node 18) and npm.

```bash
npm install
npm run dev      # development server with Turbopack, http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

Docker:

```bash
docker build -t bopeep-frontend .
docker run -p 3000:3000 bopeep-frontend
```

The backend base URL (`https://api.marcianos.me/v1`) is hardcoded in the route handlers under `src/app/api/`.

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that tags a version, builds and publishes the Docker image, and updates the deployment on a GKE cluster using the manifests in `k8s/`.

## Context

Frontend component of the Marcianos Operator platform; the backend services are not part of this repository.

## License

Apache License 2.0. See [LICENSE](LICENSE).
