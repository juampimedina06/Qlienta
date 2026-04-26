import { Proyecto } from "@/interface/proyecto";
import { ClientCard } from "./ClienteCard";
import { FolderOpen } from "lucide-react";

interface ClientListProps {
  proyectos: Proyecto[];
  loading?: boolean;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (proyecto: Proyecto) => void;
}

export function ClientList({
  proyectos,
  loading,
  onEdit,
  onDelete,
}: ClientListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-52 rounded-2xl bg-muted/40 animate-pulse ring-1 ring-border/30"
          />
        ))}
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="p-5 rounded-2xl bg-muted/30 ring-1 ring-border/30">
          <FolderOpen size={32} className="text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">
            No hay proyectos
          </p>
          <p className="text-xs text-muted-foreground/60">
            Todavía no se registraron proyectos con estos filtros.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {proyectos.map((proyecto) => (
        <ClientCard
          key={proyecto.id}
          proyecto={proyecto}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
