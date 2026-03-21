import { useNavigate } from 'react-router';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

export default function UnauthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6">
            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <ShieldAlert size={280} className="text-destructive" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive border border-destructive/20 mb-4 shadow-xl">
                        <Lock size={40} />
                    </div>
                    <div className="text-8xl font-black tracking-tighter text-destructive">403</div>
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
            <p className="text-muted-foreground text-center max-w-md mb-10">
                You don't have the required permissions to view this resource. 
                Please contact your administrator if you believe this is an error.
            </p>

            <Button
                onClick={() => navigate('/dashboard')}
                className="gap-2 h-12 px-8 rounded-xl font-bold shadow-xl shadow-foreground/10"
            >
                <ArrowLeft size={18} /> Back to Dashboard
            </Button>
        </div>
    );
}
