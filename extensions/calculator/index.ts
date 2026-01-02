import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import type { SearchResult } from "../../src/extension-loader/types";

export async function search(query: string): Promise<SearchResult[]> {
    const mathRegex = /^[\d\s+\-*/().^]+$/;
    if (!mathRegex.test(query)) return [];

    // Very basic check to ensure it looks like a calculation
    const hasOperator = /[+\-*/.^]/.test(query);
    if (!hasOperator) return [];

    try {
        // Simple evaluation logic for basic math
        // In a real app, use a library like mathjs
        const evaluate = (str: string) => {
            try {
                return Function(`'use strict'; return (${str})`)();
            } catch {
                return null;
            }
        };

        const result = evaluate(query);
        if (result === null || isNaN(result) || !isFinite(result)) return [];

        return [
            {
                id: `calc-${query}`,
                title: `${result}`,
                subtitle: `Calculator: ${query}`,
                icon: "🧮",
                extensionId: "calculator",
                action: async () => {
                    await writeText(String(result));
                }
            }
        ];
    } catch {
        return [];
    }
}
