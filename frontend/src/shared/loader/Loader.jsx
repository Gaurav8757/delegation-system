export default function Loader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100vh] p-8">
            <div className="relative">
                {/* Outer spin */}
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                {/* Inner spin (reverse) */}
                <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-transparent border-t-primary/40 animate-spin-reverse opacity-70"></div>
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
            </div>
            <p className="mt-6 text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">
                Synchronizing...
            </p>
        </div>
    );
}
