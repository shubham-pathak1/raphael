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
                group flex items-center px-4 py-2 gap-3 rounded-xl cursor-default transition-all duration-200 relative
                ${selected ? "bg-white/[0.08]" : "hover:bg-white/[0.03]"}
            `}
        >
            {selected && (
                <div className="absolute left-0 w-1 h-5 bg-accent rounded-r-full shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            )}

            <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                ${selected ? "scale-110" : "opacity-60"}
            `}>
                {result.icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className={`
                    text-[13px] font-medium truncate tracking-tight transition-colors duration-200
                    ${selected ? "text-foreground" : "text-muted group-hover:text-foreground/80"}
                `}>
                    {result.title}
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-medium text-muted/30">⏎</span>
            </div>
        </div>
    );
};

export default ResultItem;
