import { Loader2 } from "lucide-react";

export default function LoadingAnimado({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className || ""}`}>
      <Loader2 className="h-10 w-10 animate-spin text-zinc-400 opacity-70" />
      <span className="text-xs font-bold text-zinc-400 opacity-50 uppercase tracking-widest animate-pulse">Cargando...</span>
    </div>
  );
}
