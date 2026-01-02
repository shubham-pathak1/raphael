import React, { useRef, useEffect } from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="h-14 flex items-center px-4 gap-3 border-b border-border/50 group bg-background/20 backdrop-blur-md">
            <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted hover:text-foreground">
                <ChevronLeft size={18} />
            </button>

            <div className="flex-1 flex items-center relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type to filter entries..."
                    className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted/50 text-base font-medium selection:bg-accent/30"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-white/[0.02] cursor-default hover:bg-white/5 transition-colors">
                <span className="text-[11px] font-semibold text-muted tracking-tight">All Types</span>
                <ChevronDown size={12} className="text-muted/50" />
            </div>
        </div>
    );
};

export default SearchInput;
