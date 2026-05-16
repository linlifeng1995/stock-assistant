# Stock Assistant

A personal stock trading assistant desktop app built with Electron + React + TypeScript.

## Features
- Dashboard with trading summary
- Daily Plans management (CRUD)
- Trade Logs (CRUD)
- Daily Review journaling
- App Settings with notifications
- Local SQLite persistence

## Tech Stack
- Electron 32
- React 18 + TypeScript
- Vite + electron-vite
- Ant Design (antd)
- better-sqlite3

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Package Desktop App
```bash
npm run build && npx electron-builder
```

## Project Structure
```
stock-assistant/
├── electron/           # Electron main process + preload
│   ├── main.ts
│   ├── preload.ts
│   └── db/             # SQLite database layer
├── src/                # React renderer
│   ├── pages/          # App pages
│   ├── components/     # Shared components
│   └── types/          # TypeScript types
├── index.html
├── vite.config.ts
└── package.json
```

<!-- original readme below -->
# stock-assistant
股票交易助手
