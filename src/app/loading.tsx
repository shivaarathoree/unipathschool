export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">Loading</p>
            </div>
        </div>
    );
}
