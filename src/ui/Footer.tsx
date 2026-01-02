import React from "react";

interface FooterProps {
    title?: string;
}

const Footer: React.FC<FooterProps> = ({ title = "Raphael" }) => {
    return (
        <div className="h-8 border-t border-white/[0.05] flex items-center justify-between px-4 bg-background/20 select-none">
            <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-muted/30 uppercase tracking-[0.2em]">{title}</span>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 opacity-30">
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Actions</span>
                    <kbd className="px-1 py-0.5 rounded bg-white/5 text-[8px] font-bold text-muted border border-white/10 uppercase">⌘ K</kbd>
                </div>
            </div>
        </div>
    );
};

export default Footer;
