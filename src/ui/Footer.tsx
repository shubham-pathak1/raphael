import React from "react";
import { Zap } from "lucide-react";

interface FooterProps {
    title?: string;
}

const Footer: React.FC<FooterProps> = ({ title = "Raphael" }) => {
    return (
        <div className="h-10 border-t border-border flex items-center justify-between px-3 bg-background-subtle/50 backdrop-blur-sm select-none">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center">
                    <Zap size={12} className="text-accent" />
                </div>
                <span className="text-[11px] font-medium text-muted uppercase tracking-wider">{title}</span>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                    <span className="text-[10px] font-medium text-muted">Copy to Clipboard</span>
                    <div className="flex items-center gap-0.5">
                        <kbd className="min-w-[16px] h-4 flex items-center justify-center rounded bg-white/10 text-[9px] font-medium text-foreground px-1 border border-white/5">↵</kbd>
                    </div>
                </div>

                <div className="w-[1px] h-3 bg-border" />

                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                    <span className="text-[10px] font-medium text-muted">Actions</span>
                    <div className="flex items-center gap-1">
                        <kbd className="min-w-[16px] h-4 flex items-center justify-center rounded bg-white/10 text-[9px] font-medium text-foreground px-1 border border-white/5">⌘</kbd>
                        <kbd className="min-w-[16px] h-4 flex items-center justify-center rounded bg-white/10 text-[9px] font-medium text-foreground px-1 border border-white/5">K</kbd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
