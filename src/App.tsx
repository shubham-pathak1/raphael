import { useState, useCallback, useEffect } from "react";
import SearchInput from "./ui/SearchInput";
import ResultList from "./ui/ResultList";
import type { SearchResult } from "./extension-loader/types";
import { fuzzyMatch } from "./search";
import { extensionLoader } from "./extension-loader";

// Placeholder results for when no extensions are loaded or responding
const MOCK_RESULTS: SearchResult[] = [
    {
        id: "calc",
        title: "Calculator",
        subtitle: "Perform quick calculations",
        icon: "🧮",
        extensionId: "calculator",
    },
    {
        id: "web",
        title: "Search Google",
        subtitle: "Web Search",
        icon: "🔍",
        extensionId: "web-search",
    },
    {
        id: "files",
        title: "File Search",
        subtitle: "Find files and folders",
        icon: "📁",
        extensionId: "file-search",
    },
    {
        id: "system",
        title: "System Commands",
        subtitle: "Control your machine",
        icon: "⚙️",
        extensionId: "system-commands",
    },
];

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        extensionLoader.initialize();
    }, []);

    const handleQueryChange = useCallback(async (value: string) => {
        setQuery(value);
        setSelectedIndex(0);

        if (!value.trim()) {
            setResults([]);
            return;
        }

        try {
            // Get results from loaded extensions
            const extensionResults = await extensionLoader.search(value);

            if (extensionResults.length > 0) {
                setResults(extensionResults);
            } else {
                // Fallback to matching MOCK_RESULTS for now
                const filtered = MOCK_RESULTS.filter(item =>
                    fuzzyMatch(value, item.title) > 0 || fuzzyMatch(value, item.subtitle || "") > 0
                ).sort((a, b) => {
                    const scoreA = Math.max(fuzzyMatch(value, a.title), fuzzyMatch(value, a.subtitle || "") * 0.8);
                    const scoreB = Math.max(fuzzyMatch(value, b.title), fuzzyMatch(value, b.subtitle || "") * 0.8);
                    return scoreB - scoreA;
                });
                setResults(filtered);
            }
        } catch (error) {
            console.error("Search failed:", error);
        }
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case "Enter":
                    if (results[selectedIndex]) {
                        console.log("Execute:", results[selectedIndex]);
                    }
                    break;
                case "Escape":
                    setQuery("");
                    setResults([]);
                    break;
            }
        },
        [results, selectedIndex]
    );

    const handleResultClick = useCallback((index: number) => {
        setSelectedIndex(index);
        console.log("Execute:", results[index]);
    }, [results]);

    return (
        <div
            className="h-full w-full glass rounded-xl overflow-hidden flex flex-col shadow-premium"
            onKeyDown={handleKeyDown}
        >
            <SearchInput value={query} onChange={handleQueryChange} />
            <div className="flex-1 overflow-hidden">
                {results.length > 0 ? (
                    <ResultList
                        results={results}
                        selectedIndex={selectedIndex}
                        onSelect={handleResultClick}
                    />
                ) : query.trim() ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted animate-fade-in p-8">
                        <div className="text-4xl mb-4">💨</div>
                        <p className="text-sm font-medium">No results found for "{query}"</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted animate-fade-in p-8 opacity-40">
                        <div className="text-2xl mb-2 italic">Raphael</div>
                        <p className="text-xs">Your personal system companion</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
