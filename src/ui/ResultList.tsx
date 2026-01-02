import React from "react";
import type { SearchResult } from "../extension-loader/types";
import ResultItem from "./ResultItem";

interface ResultListProps {
    results: SearchResult[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

const ResultList: React.FC<ResultListProps> = ({
    results,
    selectedIndex,
    onSelect,
}) => {
    return (
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-4">
            {results.map((result, index) => (
                <ResultItem
                    key={result.id}
                    result={result}
                    selected={index === selectedIndex}
                    onClick={() => onSelect(index)}
                />
            ))}
        </div>
    );
};

export default ResultList;
