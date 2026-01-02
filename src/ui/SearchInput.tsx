import { useRef, useEffect } from "react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
                <svg
                    className="w-5 h-5 text-accent flex-shrink-0 opacity-80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="What are we doing today?"
                    className="flex-1 bg-transparent text-text-primary text-lg placeholder:text-text-muted outline-none font-medium"
                    autoFocus
                />
                {value && (
                    <div className="flex items-center gap-2 animate-fade-in">
                        <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold px-1.5 py-0.5 bg-white/5 rounded">
                            ESC
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
