import { useNavigate } from 'react-router';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6">
            <div className="relative mb-8">
                <div className="text-[12rem] font-black opacity-5 select-none leading-none text-foreground/20">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                    <Ghost size={80} className="text-primary animate-bounce-slow" />
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
            <p className="text-muted-foreground text-center max-w-md mb-10 text-sm">
                Oops! The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="gap-2 h-11 px-8 rounded-full font-bold"
                >
                    <ArrowLeft size={18} /> Go Back
                </Button>
                <Button
                    onClick={() => navigate('/dashboard')}
                    className="gap-2 h-11 px-8 rounded-full font-bold shadow-lg shadow-primary/20"
                >
                    <Home size={18} /> Return Home
                </Button>
            </div>
        </div>
    );
}
