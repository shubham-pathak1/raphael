# Extension API Documentation

## Overview

Extensions provide search results, actions, or background services. They're written in TypeScript and can include React components for custom UI.

## Extension Structure

```
extensions/
└── my-extension/
    ├── manifest.json    # Extension metadata and permissions
    └── index.ts         # Main entry point
```

## Manifest Schema

```json
{
  "id": "my-extension",
  "name": "My Extension",
  "version": "1.0.0",
  "description": "What this extension does",
  "permissions": ["storage", "http"],
  "main": "index.ts"
}
```

## Available Permissions

| Permission | Description |
|------------|-------------|
| `clipboard:read` | Read from clipboard |
| `clipboard:write` | Write to clipboard |
| `fs:read` | Read files from disk |
| `fs:write` | Write files to disk |
| `http` | Make HTTP requests |
| `shell:open` | Open URLs in browser |
| `shell:execute` | Execute system commands |
| `system:info` | Access system information |
| `storage` | Persist extension data |

## Extension API

### Search Results

```typescript
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  action?: () => void | Promise<void>;
}
```

### Extension Interface

```typescript
interface Extension {
  onLoad?: () => void | Promise<void>;
  onUnload?: () => void | Promise<void>;
  search?: (query: string) => SearchResult[] | Promise<SearchResult[]>;
}
```

### Storage API

```typescript
interface Storage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}
```

## Example Extension

```typescript
import type { Extension, SearchResult } from "@raphael/extension-api";

const extension: Extension = {
  async search(query: string): Promise<SearchResult[]> {
    if (!query.match(/^[0-9+\-*/\s.()]+$/)) {
      return [];
    }
    
    try {
      const result = eval(query);
      return [{
        id: "calc-result",
        title: String(result),
        subtitle: query,
        icon: "🧮"
      }];
    } catch {
      return [];
    }
  }
};

export default extension;
```
