import React from "react";
import type { SearchResult } from "../extension-loader/types";

interface ResultPreviewProps {
    result: SearchResult | null;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in text-muted/10">
                <div className="text-8xl font-bold opacity-10 select-none">R</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-8 animate-fade-in overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-bold text-muted/20 tracking-tighter uppercase">{result.extensionId}</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-accent/20 blur-[60px] opacity-40 rounded-full" />
                    <div className="w-24 h-24 rounded-2xl glass-subtle flex items-center justify-center relative z-10 shadow-3xl border border-white/10">
                        <div className="text-foreground scale-[2]">
                            {result.icon}
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-foreground tracking-tight">
                        {result.title}
                    </h2>
                    <p className="text-muted tracking-tight text-xs opacity-60">
                        {result.subtitle}
                    </p>
                </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3 mt-auto">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">Available Action</span>
                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-bold uppercase tracking-wider">Execute</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-foreground/80">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-white/5 border border-white/10 text-[10px]">⏎</span>
                    <span>Press Enter to perform action</span>
                </div>
            </div>
        </div>
    );
};

export default ResultPreview;
