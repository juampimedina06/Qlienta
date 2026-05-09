import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  Trash2,
  MapPin,
  Eye,
  Mail,
  Building2,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FuturoCliente } from "@/interface/futuro-cliente";

interface FuturoClienteCardProps {
  futuroCliente: FuturoCliente;
  onEdit: (futuroCliente: FuturoCliente) => void;
  onDelete: (futuroCliente: FuturoCliente) => void;
  basePath?: string;
}

const estadoConfig = {
  "en creacion": { variant: "secondary" as const, label: "En creación" },
  creado: { variant: "outline" as const, label: "Nuevo" },
  aceptado: { variant: "default" as const, label: "Aceptado" },
  rechazado: { variant: "destructive" as const, label: "Rechazado" },
};

export function FuturoClienteCard({
  futuroCliente,
  onEdit,
  onDelete,
  basePath = "/admin/futurosClientes",
}: FuturoClienteCardProps) {
  const estado =
    estadoConfig[futuroCliente.estado] ?? estadoConfig["en creacion"];

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-[#050505]/80 transition-colors hover:border-border/80">
      {/* Body */}
      <div className="flex flex-col gap-5 p-5">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <Badge
            variant={estado.variant}
            className="rounded-full px-3 py-0.5 text-[11px] font-medium"
          >
            {estado.label}
          </Badge>
          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Calendar size={12} />
            {format(new Date(futuroCliente.created_at), "d MMMM", {
              locale: es,
            })}
          </span>
        </div>

        {/* Identity */}
        <div className="flex items-center gap-4">
          {futuroCliente.logo_negocio ? (
            <Image
              src={futuroCliente.logo_negocio}
              alt={futuroCliente.nombre_negocio}
              width={42}
              height={42}
              className="rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
              <Building2 size={18} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-[15px] font-medium text-foreground">
              {futuroCliente.nombre_negocio}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {futuroCliente.categoria}
            </p>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <a
            href={futuroCliente.ubicacion_negocio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin size={13} className="shrink-0" />
            <span className="truncate">{futuroCliente.ubicacion_negocio}</span>
          </a>
          <div className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
            <Mail size={13} className="shrink-0" />
            <span className="truncate">{futuroCliente.email_contacto}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
        {futuroCliente.proyecto_desplegado ? (
          <a
            href={futuroCliente.proyecto_desplegado}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-green-600 hover:text-foreground transition-colors font-bold"
          >
            <ExternalLink size={12} />
            Ver sitio
          </a>
        ) : null}

        <div className="flex items-center gap-1.5">
          <Link href={`${basePath}/${futuroCliente.id}`}>
            <span className="flex items-center justify-center h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-foreground">
              <Eye size={13} />
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(futuroCliente)}
          >
            <Edit size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg border border-border text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(futuroCliente)}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>
    </div>
  );
}
