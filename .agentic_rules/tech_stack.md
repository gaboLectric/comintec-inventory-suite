# Technology Stack

## Backend
- **PocketBase**: v0.22+ (Go based, embedded SQLite)
- **Database**: SQLite (managed by PocketBase)
- **Auth**: Built-in PocketBase Auth (Email/Password)

## Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: JavaScript (JSX) / TypeScript (TSX) support
- **Styling**: 
  - Emotion (@emotion/react, @emotion/styled)
  - Tailwind CSS (v3/v4)
  - Lucide React (Icons)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios (configured in `bootstrap.js`)
- **Charts**: Chart.js + react-chartjs-2

## DevOps
- **Containerization**: Docker + Docker Compose
- **Base Images**: 
  - Frontend: `node:20-alpine`
  - Backend: `ghcr.io/muchobien/pocketbase:latest`

## Tools
- **MCP**: Model Context Protocol (sqlite, filesystem, context-mapper)
- **Editor**: VS Code
