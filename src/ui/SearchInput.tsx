import React, { useRef, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onKeyDown }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="h-16 flex items-center px-6 gap-5 border-b border-white/[0.05] group">
            <Search size={22} className="text-white group-focus-within:text-white transition-colors" />

            <div className="flex-1 flex items-center relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Search apps, files, and more..."
                    className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted/30 text-lg font-medium selection:bg-accent/30 tracking-tight"
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>

            <div className="flex items-center gap-1.5 opacity-20 group-focus-within:opacity-40 transition-opacity">
                <kbd className="px-1.5 py-0.5 rounded border border-white/20 text-[9px] font-bold">ESC</kbd>
            </div>
        </div>
    );
};

export default SearchInput;
