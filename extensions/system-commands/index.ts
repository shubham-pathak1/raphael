import { getCurrentWindow } from "@tauri-apps/api/window";
import type { SearchResult } from "../../src/extension-loader/types";

export async function search(query: string): Promise<SearchResult[]> {
    const commands = [
        {
            id: "restart",
            title: "Restart Raphael",
            subtitle: "System Command",
            icon: "♻️",
            action: () => { window.location.reload(); }
        },
        {
            id: "quit",
            title: "Quit Raphael",
            subtitle: "System Command",
            icon: "🚪",
            action: async () => { await getCurrentWindow().close(); }
        },
        {
            id: "dev-tools",
            title: "Open DevTools",
            subtitle: "System Command",
            icon: "🏗️",
            action: async () => {
                const { invoke } = await import("@tauri-apps/api/core");
                await invoke("toggle_devtools");
            }
        },
    ];

    if (!query.trim()) return [];

    return commands
        .filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()))
        .map(cmd => ({
            ...cmd,
            id: `sys-${cmd.id}`,
            extensionId: "system-commands",
        }));
}
