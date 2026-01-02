/**
 * Fuzzy search utilities
 */

/** Simple fuzzy match score */
export function fuzzyMatch(query: string, target: string): number {
    const q = query.toLowerCase();
    const t = target.toLowerCase();

    if (t.includes(q)) {
        return 1.0;
    }

    let queryIndex = 0;
    let score = 0;
    let consecutiveBonus = 0;

    for (let i = 0; i < t.length && queryIndex < q.length; i++) {
        if (t[i] === q[queryIndex]) {
            score += 1 + consecutiveBonus;
            consecutiveBonus += 0.5;
            queryIndex++;
        } else {
            consecutiveBonus = 0;
        }
    }

    if (queryIndex < q.length) {
        return 0;
    }

    return score / t.length;
}

/** Sort results by fuzzy match score */
export function sortByRelevance<T extends { title: string }>(
    items: T[],
    query: string
): T[] {
    return [...items].sort((a, b) => {
        const scoreA = fuzzyMatch(query, a.title);
        const scoreB = fuzzyMatch(query, b.title);
        return scoreB - scoreA;
    });
}
