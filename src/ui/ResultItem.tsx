import React from "react";
import type { SearchResult } from "../extension-loader/types";


interface ResultItemProps {
    result: SearchResult;
    selected: boolean;
    onClick: () => void;
}



const ResultItem: React.FC<ResultItemProps> = ({ result, selected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        group flex items-center px-3 py-2.5 gap-3 rounded-lg cursor-default transition-all duration-100 mx-1
        ${selected ? "bg-white/[0.08] shadow-sm" : "hover:bg-white/[0.03]"}
      `}
        >
            <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center transition-colors glass-subtle
        ${selected ? "text-foreground bg-white/5 border-white/10" : "text-muted group-hover:text-foreground/80"}
      `}>
                {result.icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className={`
            text-sm font-medium truncate tracking-tight
            ${selected ? "text-foreground" : "text-muted group-hover:text-foreground/90"}
        `}>
                    {result.title}
                </div>
            </div>

            {selected && (
                <div className="text-[9px] font-bold text-muted/40 uppercase tracking-[0.2em] px-1 animate-fade-in translate-y-[1px]">
                    Select
                </div>
            )}
        </div>
    );
};

export default ResultItem;
