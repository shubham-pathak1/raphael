import React from "react";
import type { SearchResult } from "../extension-loader/types";

interface ResultPreviewProps {
    result: SearchResult | null;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center animate-fade-in text-muted/30">
                <div className="text-6xl mb-6">🎨</div>
                <p className="text-sm font-medium tracking-wide">Raphael</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-8 animate-fade-in overflow-y-auto">
            <div className="flex flex-col items-center text-center mb-12 mt-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-accent/20 blur-[40px] opacity-40 group-hover:opacity-60 transition-opacity rounded-full" />
                    <div className="w-36 h-36 rounded-[2.5rem] glass-subtle flex items-center justify-center relative z-10 shadow-2xl overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                        <div className="text-foreground/80 scale-[1.5]">
                            {result.icon}
                        </div>
                    </div>
                </div>
                <div className="space-y-1.5 mt-8">
                    <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                        {result.title}
                    </h2>
                    <p className="text-muted font-medium tracking-wide text-sm opacity-60">
                        {result.subtitle}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="p-4 rounded-xl glass-subtle space-y-3">
                    <h3 className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Information</h3>

                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted font-medium">Extension</span>
                            <span className="text-foreground tracking-tight">{result.extensionId}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted font-medium">Identity</span>
                            <span className="text-foreground/80 font-mono text-[10px]">{result.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="px-2.5 py-1 rounded-full border border-border/50 text-[10px] font-bold text-muted/80 uppercase tracking-widest bg-white/[0.02]">
                        Copy Title
                    </div>
                    <div className="px-2.5 py-1 rounded-full border border-border/50 text-[10px] font-bold text-muted/80 uppercase tracking-widest bg-white/[0.02]">
                        Execute Action
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultPreview;
