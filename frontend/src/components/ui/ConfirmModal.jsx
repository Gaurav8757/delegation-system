import { Modal } from './Modal.jsx';
import { Button } from './button.jsx';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm Action", 
    description = "Are you sure you want to proceed? This action cannot be undone.", 
    confirmText = "Confirm", 
    cancelText = "Cancel", 
    variant = "destructive",
    isLoading = false 
}) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border",
                    variant === "destructive" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                    <AlertCircle size={24} />
                </div>
                
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex gap-3 w-full pt-4">
                    <Button 
                        variant="outline" 
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button 
                        variant={variant} 
                        onClick={onConfirm}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 size={18} className="mr-2 animate-spin" /> : null}
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
