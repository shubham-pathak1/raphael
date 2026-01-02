import { useState, useCallback, useEffect } from "react";
import SearchInput from "./ui/SearchInput";
import ResultList from "./ui/ResultList";
import ResultPreview from "./ui/ResultPreview";
import Footer from "./ui/Footer";
import type { SearchResult } from "./extension-loader/types";
import { extensionLoader } from "./extension-loader";

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        extensionLoader.initialize();
    }, []);

    const performSearch = useCallback(async (value: string) => {
        if (!value.trim()) {
            setResults([]);
            return;
        }

        try {
            const extensionResults = await extensionLoader.search(value);
            setResults(extensionResults);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query) {
                performSearch(query);
            }
        }, 200); // Snappy 200ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, performSearch]);

    const handleQueryChange = useCallback((value: string) => {
        setQuery(value);
        setSelectedIndex(0);
        if (!value.trim()) {
            setResults([]);
        }
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            e.stopPropagation();
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
                    e.preventDefault();
                    console.log("[App] Enter pressed. Index:", selectedIndex);
                    const selected = results[selectedIndex];
                    console.log("[App] Selected Item:", selected);

                    if (selected) {
                        if (selected.action) {
                            console.log("[App] Executing action for:", selected.id);
                            try {
                                const actionResult = selected.action();
                                if (actionResult instanceof Promise) {
                                    actionResult.then(() => console.log("[App] Action promise resolved"))
                                        .catch(err => console.error("[App] Action promise failed:", err));
                                }
                            } catch (err) {
                                console.error("[App] Action execution failed synchronously:", err);
                            }
                        } else {
                            console.warn("[App] Item has no action defined");
                        }
                    } else {
                        console.warn("[App] No item selected at index", selectedIndex);
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
        const selected = results[index];
        if (selected && selected.action) {
            selected.action();
        }
    }, [results]);

    const selectedResult = results[selectedIndex] || null;
    const footerTitle = selectedResult ? selectedResult.extensionId.replace("-", " ") : "Raphael";

    return (
        <div
            className="h-full w-full glass rounded-2xl overflow-hidden flex flex-col shadow-premium border border-white/5 animate-scale-in"
        >
            <SearchInput value={query} onChange={handleQueryChange} onKeyDown={handleKeyDown} />

            <div className="flex-1 flex overflow-hidden">
                {/* Result List Column */}
                <div className="w-[260px] h-full border-r border-white/[0.05] overflow-hidden flex flex-col pt-4">
                    <div className="px-6 mb-2">
                        <span className="text-[10px] font-bold text-muted/30 uppercase tracking-[0.2em]">Suggestions</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {results.length > 0 ? (
                            <ResultList
                                results={results}
                                selectedIndex={selectedIndex}
                                onSelect={handleResultClick}
                            />
                        ) : query.trim() ? (
                            <div className="h-40 flex flex-col items-center justify-center text-muted/40 p-8">
                                <p className="text-xs font-medium">No results found</p>
                            </div>
                        ) : (
                            <div className="h-40 flex flex-col items-center justify-center text-muted/5 p-8 space-y-2">
                                <div className="w-12 h-1.5 bg-current rounded-full" />
                                <div className="w-8 h-1.5 bg-current rounded-full" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Column */}
                <div className="flex-1 h-full bg-white/[0.01]">
                    <ResultPreview result={selectedResult} />
                </div>
            </div>

            <Footer title={footerTitle} />
        </div>
    );
}

export default App;
