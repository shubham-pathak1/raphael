# Raphael

> [!NOTE]
> **Raphael** is a high-performance, minimalist productivity launcher designed for speed and visual excellence. Built with Tauri 2.0 and React 18.

Raphael provides a centralized, keyboard-first interface for application launching, real-time calculations, and system management through a modular, extension-based architecture.

## Overview

Raphael combines the performance of Rust with the flexibility of React to deliver a premium, non-intrusive launcher experience. It resides in the background and is summoned instantly via global shortcuts.

## Key Features

- **Global Toggle**: Instant access from any window using `Alt + Space`.
- **Modular Core**: Functionality is encapsulated in isolated extensions.
- **Unified Search**: Aggregated, fuzzy-matched results from all active sources.
- **Glassmorphic UI**: Ultra-minimalist design with deep backdrop blur and fluid animations.

## Core Extensions

| Extension | Description | Action |
| :--- | :--- | :--- |
| **App Launcher** | Scans Windows Start Menu for installed apps | Open / Launch Application |
| **Calculator** | Safe mathematical expression evaluation | Copy Result to Clipboard |
| **File Search** | Rapid shallow search in user's Documents | Open File or Directory |
| **Web Search** | Direct search engine integration | Open Google Results |
| **System** | Native window and process management | Restart / Quit / DevTools |

## Technical Architecture

### Backend (Rust)
- **Engine**: Tauri 2.0 with the latest Capabilities system.
- **Native APIs**: Direct interface with Windows Shell, Clipboard, and Opener.
- **Performance**: Optimized filesystem traversal for application discovery.

### Frontend (TypeScript)
- **Framework**: React 18 with Vite for near-instant rendering.
- **Styling**: Tailwind CSS with custom glassmorphism design tokens.
- **Icons**: Professional Lucide-React iconography.

## Installation

### Prerequisites
- [Rust & Cargo](https://rustup.rs/)
- [Node.js (LTS)](https://nodejs.org/)

### Setup
```bash
# Clone
git clone https://github.com/shubham-pathak1/raphael.git && cd raphael

# Install
npm install

# Develop
npm run tauri dev

# Build
npm run tauri build
```

## Shortcuts

- `Alt + Space` — Toggle Launcher Visibility
- `Enter` — Execute Selected Result
- `↑ / ↓` — Navigate Results
- `Esc` — Hide / Clear Query

## Project Map

```text
├── src-tauri/      # Native logic & Configuration
├── src/            # Core UI & Extension Loader
├── extensions/     # Modular functionality
└── capabilities/   # Permission management
```

## License
MIT
