import { invoke } from "@tauri-apps/api/core";
import type { SearchResult } from "../../src/extension-loader/types";

interface FileInfo {
    name: string;
    path: string;
    is_dir: boolean;
}

export async function search(query: string): Promise<SearchResult[]> {
    if (!query.trim() || query.length < 3) return []; // Enforce limit here for safety

    try {
        const files = await invoke<FileInfo[]>("search_files", { query });

        return files.map(file => ({
            id: `file-${file.path}`,
            title: file.name,
            subtitle: file.path,
            icon: file.is_dir ? "📂" : "📄",
            extensionId: "file-search",
            action: async () => {
                await invoke("open_item", { path: file.path });
            }
        }));
    } catch (error) {
        console.error("File search failed:", error);
        return [];
    }
}
