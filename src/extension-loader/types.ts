/**
 * Extension System Type Definitions
 */

/** Result item returned by extensions */
export interface SearchResult {
    id: string;
    title: string;
    subtitle?: string;
    icon?: string;
    extensionId: string;
    action?: () => void | Promise<void>;
    metadata?: Record<string, unknown>;
}

/** Extension manifest definition */
export interface ExtensionManifest {
    id: string;
    name: string;
    version: string;
    description?: string;
    author?: string;
    permissions: ExtensionPermission[];
    main: string;
}

/** Available permissions an extension can request */
export type ExtensionPermission =
    | "clipboard:read"
    | "clipboard:write"
    | "fs:read"
    | "fs:write"
    | "http"
    | "shell:open"
    | "shell:execute"
    | "system:info"
    | "storage";

/** Extension lifecycle hooks */
export interface Extension {
    manifest: ExtensionManifest;
    onLoad?: () => void | Promise<void>;
    onUnload?: () => void | Promise<void>;
    search?: (query: string) => SearchResult[] | Promise<SearchResult[]>;
}

/** Extension context passed to extensions */
export interface ExtensionContext {
    storage: {
        get: <T>(key: string) => Promise<T | null>;
        set: <T>(key: string, value: T) => Promise<void>;
        remove: (key: string) => Promise<void>;
    };
}
