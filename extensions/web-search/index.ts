import { openUrl } from "@tauri-apps/plugin-opener";
import type { SearchResult } from "../../src/extension-loader/types";

export async function search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    return [
        {
            id: `web-search-${query}`,
            title: `Search "${query}" on Google`,
            subtitle: "Web Search",
            icon: "🔍",
            extensionId: "web-search",
            action: async () => {
                await openUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
            }
        }
    ];
}
