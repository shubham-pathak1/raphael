import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import type { SearchResult } from "../../src/extension-loader/types";
import { evaluate } from "mathjs";

export async function search(query: string): Promise<SearchResult[]> {
    const mathRegex = /^[\d\s+\-*/().^]+$/;
    if (!mathRegex.test(query)) return [];

    // Very basic check to ensure it looks like a calculation
    const hasOperator = /[+\-*/.^]/.test(query);
    if (!hasOperator) return [];

    try {
        // Use mathjs for accurate evaluation
        const result = evaluate(query);
        
        if (result === null || (typeof result === 'number' && (isNaN(result) || !isFinite(result)))) {
            return [];
        }

        // Format result for display (handle large numbers and decimals)
        let displayResult: string;
        if (typeof result === 'number') {
            // Use appropriate formatting for large/small numbers
            if (Math.abs(result) > 1e10 || (Math.abs(result) < 1e-10 && result !== 0)) {
                displayResult = result.toExponential(10);
            } else if (Number.isInteger(result)) {
                displayResult = String(result);
            } else {
                // Limit decimal places to 10
                displayResult = parseFloat(result.toFixed(10)).toString();
            }
        } else {
            displayResult = String(result);
        }

        return [
            {
                id: `calc-${query}`,
                title: `${displayResult}`,
                subtitle: `Calculator: ${query}`,
                icon: "✨",
                extensionId: "calculator",
                action: async () => {
                    await writeText(displayResult);
                }
            }
        ];
    } catch {
        return [];
    }
}
