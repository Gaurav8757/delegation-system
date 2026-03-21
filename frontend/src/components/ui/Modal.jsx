import { X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../lib/utils.js';
import { Button } from './button.jsx';

export function Modal({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    className,
    footer 
}) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={cn(
                "bg-card w-full max-w-lg border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative z-10",
                className
            )}>
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                    <Button 
                        variant="ghost"
                        size="icon"
                        onClick={onClose} 
                        className="h-8 w-8 rounded-full"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="p-6 border-t border-border bg-muted/30">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
