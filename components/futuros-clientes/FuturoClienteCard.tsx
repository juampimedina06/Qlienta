import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Tag,
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
  "en creacion": {
    color: "bg-muted/50 text-muted-foreground border-border",
    label: "En creación",
  },
  creado: {
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "Creado",
  },
  aceptado: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    label: "Aceptado",
  },
  rechazado: {
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    label: "Rechazado",
  },
};

export function FuturoClienteCard({
  futuroCliente,
  onEdit,
  onDelete,
  basePath = "/admin/futurosClientes",
}: FuturoClienteCardProps) {
  const estado =
    estadoConfig[futuroCliente.estado] || estadoConfig["en creacion"];

  return (
    <Card className="group overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-primary/30 flex flex-col">
      <CardHeader className="pb-3 space-y-3">
        {/* Estado */}
        <div className="flex items-center justify-between">
          <Badge
            className={cn(
              "px-2 py-0.5 text-[10px] uppercase font-bold tracking-wide border",
              estado.color,
            )}
          >
            {estado.label}
          </Badge>

          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar size={12} />
            {format(futuroCliente.created_at, "d MMM", { locale: es })}
          </span>
        </div>

        {/* Header negocio */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          {futuroCliente.logo_negocio ? (
            <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-border/50">
              <Image
                src={futuroCliente.logo_negocio}
                alt={futuroCliente.nombre_negocio}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center ring-1 ring-border/50">
              <Building2 size={18} className="text-muted-foreground" />
            </div>
          )}

          {/* Nombre + categoría */}
          <div className="min-w-0">
            <CardTitle className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {futuroCliente.nombre_negocio}
            </CardTitle>

            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Tag size={11} />
              {futuroCliente.categoria}
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-1 pt-1">
          <a
            href={futuroCliente.ubicacion_negocio}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-sky-500 transition-colors break-words"
          >
            <MapPin size={12} className="shrink-0 opacity-60" />
            <span className="line-clamp-1">
              {futuroCliente.ubicacion_negocio}
            </span>
          </a>

          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={12} className="opacity-60" />
            <span className="truncate">{futuroCliente.email_contacto}</span>
          </p>
        </div>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="mt-auto pt-3 flex justify-between items-center border-t border-border/20">
        <div className="flex items-center gap-1">
          {futuroCliente.proyecto_desplegado && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[10px] gap-1 border-emerald-500/30 bg-emerald-500/5 text-emerald-600 hover:bg-emerald-500/10"
              asChild
            >
              <a
                href={futuroCliente.proyecto_desplegado}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink size={12} />
                Ver Proyecto
              </a>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <Link href={`${basePath}/${futuroCliente.id}`}>
              <Eye size={14} />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-blue-50 hover:text-blue-600"
            onClick={() => onEdit(futuroCliente)}
          >
            <Edit size={14} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-rose-50 hover:text-rose-600"
            onClick={() => onDelete(futuroCliente)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
