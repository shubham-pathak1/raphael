import type { SearchResult } from "../extension-loader/types";
import ResultItem from "./ResultItem";

interface ResultListProps {
    results: SearchResult[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export default function ResultList({
    results,
    selectedIndex,
    onSelect,
}: ResultListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {results.map((result, index) => (
                <ResultItem
                    key={result.id}
                    result={result}
                    isSelected={index === selectedIndex}
                    onClick={() => onSelect(index)}
                />
            ))}
        </div>
    );
}
