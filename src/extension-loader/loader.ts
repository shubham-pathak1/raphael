/**
 * Extension Loader
 * Handles loading, lifecycle, and management of extensions
 */

import { invoke } from "@tauri-apps/api/core";
import type { Extension, ExtensionManifest, SearchResult } from "./types";

interface ExtensionInfo {
    id: string;
    name: string;
    version: string;
    description: string | null;
    author: string | null;
    path: string;
}

class ExtensionLoader {
    private extensions: Map<string, Extension> = new Map();
    private loaded: boolean = false;

    async initialize(): Promise<void> {
        try {
            const discoveredExtensions = await invoke<ExtensionInfo[]>("get_extensions");
            console.log("Discovered extensions:", discoveredExtensions);

            for (const info of discoveredExtensions) {
                const manifest: ExtensionManifest = {
                    id: info.id,
                    name: info.name,
                    version: info.version,
                    description: info.description || undefined,
                    author: info.author || undefined,
                    permissions: [], // TODO: Load permissions from actual manifest.json content if needed
                    main: "index.ts",
                };

                // In a real system, this would load a JS bundle dynamically
                // For the demonstration of default extensions, we'll hardcode the "built-in" ones
                this.extensions.set(info.id, {
                    manifest,
                    search: async (query) => {
                        try {
                            if (info.id === "web-search") {
                                const { search } = await import("../../extensions/web-search/index");
                                return search(query);
                            }
                            if (info.id === "calculator") {
                                const { search } = await import("../../extensions/calculator/index");
                                return search(query);
                            }
                            if (info.id === "system-commands") {
                                const { search } = await import("../../extensions/system-commands/index");
                                return search(query);
                            }
                            if (info.id === "app-launcher") {
                                const { search } = await import("../../extensions/app-launcher/index");
                                return search(query);
                            }
                            if (info.id === "file-search") {
                                const { search } = await import("../../extensions/file-search/index");
                                return search(query);
                            }
                        } catch (e) {
                            console.error(`Failed to load extension ${info.id}:`, e);
                        }
                        return [];
                    }
                });
            }

            this.loaded = true;
            console.log(`Initialized ExtensionLoader with ${this.extensions.size} extensions`);
        } catch (error) {
            console.error("Failed to initialize extensions:", error);
        }
    }

    async loadExtension(manifest: ExtensionManifest): Promise<void> {
        if (this.extensions.has(manifest.id)) {
            console.warn(`Extension ${manifest.id} already loaded`);
            return;
        }

        // TODO: Implement actual extension loading from file system
        // For now, this is a placeholder
        console.log(`Loading extension: ${manifest.name}`);
    }

    async unloadExtension(id: string): Promise<void> {
        const extension = this.extensions.get(id);
        if (!extension) {
            return;
        }

        if (extension.onUnload) {
            await extension.onUnload();
        }

        this.extensions.delete(id);
        console.log(`Unloaded extension: ${id}`);
    }

    async search(query: string): Promise<SearchResult[]> {
        const results: SearchResult[] = [];

        for (const [, extension] of this.extensions) {
            if (extension.search) {
                try {
                    const extensionResults = await extension.search(query);
                    results.push(...extensionResults);
                } catch (error) {
                    console.error(
                        `Extension ${extension.manifest.id} search failed:`,
                        error
                    );
                }
            }
        }

        return results;
    }

    getExtension(id: string): Extension | undefined {
        return this.extensions.get(id);
    }

    getAllExtensions(): Extension[] {
        return Array.from(this.extensions.values());
    }

    isLoaded(): boolean {
        return this.loaded;
    }
}

export const extensionLoader = new ExtensionLoader();
export default ExtensionLoader;
