# Raphael

A premium, extension-first cross-platform launcher and productivity tool built with Tauri 2.0 and React.

## 🪟 Aesthetics
Raphael features a modern, ultra-minimalist glassmorphic interface designed for speed and visual excellence. 
- **Dark Theme**: Custom HSL-based palette.
- **Glassmorphism**: Backdrop blur and subtle borders for a premium native feel.
- **Animations**: Fluid micro-animations for responsive feedback.

## ⚙️ Core Architecture
Modular and lightweight, Raphael is built with an extension-first mindset.

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite.
- **Backend**: Rust, Tauri 2.0 (using the new capabilities system).
- **Extension System**: Decoupled architecture where even core features (Calculator, Search) are modular extensions.

## 🚀 Features
- **Global Hotkey**: Toggle the launcher from anywhere using `Alt + Space`.
- **Unified Fuzzy Search**: High-performance results aggregated from all active extensions.
- **Dynamic Loading**: Extensions are discovered by the Rust backend and dynamically loaded by the frontend.
- **Modular Extensions**: Simple API for building third-party functionality.

## 📂 Project Structure
- `src-tauri/`: Rust backend, window management, and global hotkeys.
- `src/`: React frontend and the core Extension Loader.
- `extensions/`: Default and custom extensions (Web Search, Calculator, etc.).
- `docs/`: Technical documentation for the Architecture and Extension API.

## 🛠️ Development

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/)

### Setup
```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build production bundle
npm run tauri build
```

## 📄 License
MIT
