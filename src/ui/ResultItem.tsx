import type { SearchResult } from "../extension-loader/types";

interface ResultItemProps {
    result: SearchResult;
    isSelected: boolean;
    onClick: () => void;
}

export default function ResultItem({
    result,
    isSelected,
    onClick,
}: ResultItemProps) {
    return (
        <div
            onClick={onClick}
            className={`
        flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
        transition-all duration-200 group
        ${isSelected
                    ? "bg-white/10 shadow-lg translate-x-1"
                    : "hover:bg-white/5 hover:translate-x-0.5"}
      `}
        >
            <div className={`
        text-2xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg
        ${isSelected ? "bg-accent/20 text-accent" : "bg-white/5 text-text-secondary"}
        transition-colors duration-200
      `}>
                {result.icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className={`
          text-sm font-semibold truncate transition-colors duration-200
          ${isSelected ? "text-text-primary" : "text-text-secondary"}
        `}>
                    {result.title}
                </div>
                {result.subtitle && (
                    <div className={`
            text-xs truncate opacity-60 mt-0.5
            ${isSelected ? "text-text-primary" : "text-text-muted"}
          `}>
                        {result.subtitle}
                    </div>
                )}
            </div>
            {isSelected && (
                <span className="text-[10px] font-bold text-accent px-2 py-1 bg-accent/10 rounded-md animate-fade-in">
                    ENTER
                </span>
            )}
        </div>
    );
}
