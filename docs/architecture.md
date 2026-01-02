# Raphael Architecture

## Overview

Raphael is built with an extension-first architecture. The core provides minimal functionality—UI shell, extension loader, search engine, and system integration. All user-facing features are implemented as extensions.

## Core Components

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
├─────────────────────────────────────────────────┤
│  SearchInput │ ResultList │ Extension UI Slots  │
├─────────────────────────────────────────────────┤
│           Extension Loader (TypeScript)          │
├─────────────────────────────────────────────────┤
│       Fuzzy Search │ Hotkeys │ Storage API       │
├─────────────────────────────────────────────────┤
│                   IPC Bridge                     │
├─────────────────────────────────────────────────┤
│               Backend (Rust/Tauri)               │
├─────────────────────────────────────────────────┤
│  Commands │ Extension Runtime │ Platform Layer   │
├─────────────────────────────────────────────────┤
│     Windows API │ macOS API │ Linux API          │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
raphael/
├── src/                    # Frontend React code
│   ├── ui/                 # Core UI components
│   ├── extension-loader/   # Extension management
│   ├── search/             # Fuzzy matching
│   └── system/             # Hotkeys, OS integration
├── src-tauri/              # Rust backend
│   └── src/
│       ├── commands/       # Tauri IPC commands
│       ├── extensions/     # Extension sandbox
│       └── platform/       # OS-specific code
├── extensions/             # Default extensions
└── docs/                   # Documentation
```

## Data Flow

1. User types in SearchInput
2. Query dispatched to Extension Loader
3. Each extension's `search()` method called
4. Results aggregated and sorted by relevance
5. ResultList renders matches
6. User selects result → extension `action()` executed

## Security Model

Extensions declare permissions in `manifest.json`. The runtime enforces these at the IPC boundary. Users see required permissions before installation.

## Extension Lifecycle

```
Load → onLoad() → Active (search/actions) → onUnload() → Unloaded
```

Extensions are sandboxed. They communicate with the core via defined APIs only.
