import { invoke } from "@tauri-apps/api/core";
import { openPath } from "@tauri-apps/plugin-opener";
import type { SearchResult } from "../../src/extension-loader/types";

interface AppInfo {
    name: string;
    path: string;
    icon: string | null;
}

export async function search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    try {
        const apps = await invoke<AppInfo[]>("get_apps");

        return apps
            .filter(app => app.name.toLowerCase().includes(query.toLowerCase()))
            .map(app => ({
                id: `app-${app.name}-${app.path}`,
                title: app.name,
                subtitle: "Application",
                icon: "🚀",
                extensionId: "app-launcher",
                action: async () => {
                    await openPath(app.path);
                }
            }));
    } catch (error) {
        console.error("Failed to fetch apps:", error);
        return [];
    }
}
