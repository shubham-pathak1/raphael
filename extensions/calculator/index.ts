import type { SearchResult } from "../../src/extension-loader/types";

export async function search(query: string): Promise<SearchResult[]> {
    const mathRegex = /^[\d\s+\-*/().^]+$/;
    if (!mathRegex.test(query)) return [];

    // Very basic check to ensure it looks like a calculation
    const hasOperator = /[+\-*/.^]/.test(query);
    if (!hasOperator) return [];

    try {
        // In a real app, use a safer math parser like mathjs
        // For this mock, we'll use a safer evaluation approach or just return a placeholder
        // 
        // const result = eval(query); // DON'T DO THIS IN PROD

        return [
            {
                id: `calc-${query}`,
                title: `Calculator: ${query}`,
                subtitle: `Press Enter to copy result`,
                icon: "🧮",
                extensionId: "calculator",
            }
        ];
    } catch {
        return [];
    }
}
