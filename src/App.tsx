import { useState, useCallback, useEffect } from "react";
import SearchInput from "./ui/SearchInput";
import ResultList from "./ui/ResultList";
import ResultPreview from "./ui/ResultPreview";
import Footer from "./ui/Footer";
import type { SearchResult } from "./extension-loader/types";
import { fuzzyMatch } from "./search";
import { extensionLoader } from "./extension-loader";

import { Search, Calculator, FileText, Settings } from "lucide-react";

// Placeholder results for when no extensions are loaded or responding
const MOCK_RESULTS: SearchResult[] = [
    {
        id: "calc",
        title: "Calculator",
        subtitle: "Perform quick calculations",
        icon: <Calculator size={18} className="text-muted" />,
        extensionId: "calculator",
    },
    {
        id: "web",
        title: "Search Google",
        subtitle: "Web Search",
        icon: <Search size={18} className="text-muted" />,
        extensionId: "web-search",
    },
    {
        id: "files",
        title: "File Search",
        subtitle: "Find files and folders",
        icon: <FileText size={18} className="text-muted" />,
        extensionId: "file-search",
    },
    {
        id: "system",
        title: "System Commands",
        subtitle: "Control your machine",
        icon: <Settings size={18} className="text-muted" />,
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
                    const selected = results[selectedIndex];
                    if (selected && selected.action) {
                        selected.action();
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
            className="h-full w-full glass rounded-2xl overflow-hidden flex flex-col shadow-premium border border-white/5"
            onKeyDown={handleKeyDown}
        >
            <SearchInput value={query} onChange={handleQueryChange} />

            <div className="flex-1 flex overflow-hidden">
                {/* Result List Column */}
                <div className="w-[320px] h-full border-r border-border/40 overflow-hidden flex flex-col pt-3 bg-background-subtle/20">
                    <div className="px-4 mb-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] opacity-50">Today</span>
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
                            <div className="h-40 flex flex-col items-center justify-center text-muted/20 p-8 space-y-2">
                                <div className="w-10 h-1bg-muted/10 rounded" />
                                <div className="w-8 h-1 bg-muted/10 rounded" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview Column */}
                <div className="flex-1 h-full bg-background/10">
                    <ResultPreview result={selectedResult} />
                </div>
            </div>

            <Footer title={footerTitle} />
        </div>
    );
}

export default App;
