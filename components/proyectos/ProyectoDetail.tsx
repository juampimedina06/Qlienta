"use client";

import { Proyecto } from "@/interface/proyecto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { isPast, isWithinInterval, addDays } from "date-fns";
import {
  Calendar,
  ExternalLink,
  DollarSign,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Edit,
  UserPlus,
  FileText,
  StickyNote,
} from "lucide-react";
import Link from "next/link";

interface ProyectoDetailProps {
  proyecto: Proyecto;
  variant?: "admin" | "cliente";
  onDarAlta?: () => void;
}

const estadoConfig = {
  "en desarrollo": {
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "En desarrollo",
  },
  "en revision": {
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    label: "En revisión",
  },
  publicado: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    label: "Publicado",
  },
  pausado: {
    color: "bg-muted/50 text-muted-foreground border-border",
    label: "Pausado",
  },
  cancelado: {
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    label: "Cancelado",
  },
};

function getPagoAlerta(fecha: string | null) {
  if (!fecha) return null;
  const d = new Date(fecha);
  if (isPast(d)) return "vencido";
  if (isWithinInterval(d, { start: new Date(), end: addDays(new Date(), 7) }))
    return "proximo";
  return null;
}

export function ProyectoDetail({ proyecto, variant = "admin", onDarAlta }: ProyectoDetailProps) {
  const estado = estadoConfig[proyecto.estado_pagina] || estadoConfig["en desarrollo"];
  const pagoAlerta = getPagoAlerta(proyecto.fecha_proximo_pago);
  const isAdmin = variant === "admin";
  const canDarAlta = isAdmin && !proyecto.cliente_id;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin/proyectos">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
              </Button>
            </Link>
          )}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">
              Detalle del Proyecto
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {proyecto.nombre_proyecto}
            </h1>
          </div>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            {canDarAlta && (
              <Button
                onClick={onDarAlta}
                variant="outline"
                className="gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
              >
                <UserPlus size={16} />
                Dar de alta cliente
              </Button>
            )}
            <Link href={`/admin/proyectos/${proyecto.id}/editar`}>
              <Button variant="outline" className="gap-2">
                <Edit size={16} />
                Editar
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Estado + Pago + Link */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-muted/30 border border-white/5">
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Estado
          </p>
          <Badge
            className={cn("px-2.5 py-0.5 text-[10px] uppercase font-black", estado.color)}
          >
            {estado.label}
          </Badge>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            Pago
          </p>
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-bold",
              proyecto.pagado ? "text-emerald-500" : "text-rose-500",
            )}
          >
            <CheckCircle2 size={14} />
            {proyecto.pagado ? "Pagado" : "Pendiente"}
          </div>
        </div>
        {proyecto.link_pagina && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Sitio
            </p>
            <a
              href={proyecto.link_pagina}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary flex items-center gap-1.5 hover:underline font-medium truncate"
            >
              <ExternalLink size={13} /> Ver sitio
            </a>
          </div>
        )}
        {proyecto.cliente?.full_name && (
          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              Cliente
            </p>
            <p className="text-sm font-medium truncate">{proyecto.cliente.full_name}</p>
            {proyecto.cliente.email && (
              <p className="text-[10px] text-muted-foreground truncate">{proyecto.cliente.email}</p>
            )}
          </div>
        )}
      </div>

      {/* Alerta de pago */}
      {pagoAlerta && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border",
            pagoAlerta === "vencido"
              ? "bg-rose-500/5 border-rose-500/20 text-rose-500"
              : "bg-amber-500/5 border-amber-500/20 text-amber-500",
          )}
        >
          {pagoAlerta === "vencido" ? (
            <AlertTriangle size={18} />
          ) : (
            <Clock size={18} />
          )}
          <span className="text-sm font-semibold">
            {pagoAlerta === "vencido"
              ? "El pago está vencido"
              : "El próximo pago es en los próximos 7 días"}
          </span>
        </div>
      )}

      {/* Datos económicos */}
      <div className="space-y-3">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
          <DollarSign size={14} /> Datos económicos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-bold">Precio total</p>
            <p className="text-lg font-semibold">
              {proyecto.precio ? `$${proyecto.precio.toLocaleString("es-AR")}` : "—"}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-1">
            <p className="text-[10px] text-muted-foreground font-bold">Pago mensual</p>
            <p className="text-lg font-semibold">
              {proyecto.pago_mensual
                ? `$${proyecto.pago_mensual.toLocaleString("es-AR")}`
                : "—"}
            </p>
          </div>
          <div
            className={cn(
              "p-4 rounded-xl border space-y-1",
              pagoAlerta === "vencido"
                ? "bg-rose-500/5 border-rose-500/20"
                : pagoAlerta === "proximo"
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-muted/20 border-white/5",
            )}
          >
            <p className="text-[10px] text-muted-foreground font-bold">Próximo pago</p>
            <p className="text-lg font-semibold">
              {proyecto.fecha_proximo_pago
                ? format(new Date(proyecto.fecha_proximo_pago), "d MMM yyyy", {
                    locale: es,
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Tecnologías */}
      {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <Code2 size={14} /> Tecnologías
          </p>
          <div className="flex flex-wrap gap-2">
            {proyecto.tecnologias.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                <Code2 size={12} /> {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {proyecto.fecha_entrega && (
          <div className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Fecha de entrega
            </p>
            <p className="text-sm font-medium flex items-center gap-2">
              <Calendar size={14} className="text-muted-foreground" />
              {format(new Date(proyecto.fecha_entrega), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
            </p>
          </div>
        )}
        <div className="p-4 rounded-xl bg-muted/20 border border-white/5 space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
            Fecha de creación
          </p>
          <p className="text-sm font-medium flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground" />
            {format(new Date(proyecto.created_at), "d 'de' MMMM, yyyy", {
              locale: es,
            })}
          </p>
        </div>
      </div>

      {/* Documentación */}
      {proyecto.documentacion && (
        <div className="space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <FileText size={14} /> Documentación
          </p>
          <div className="p-5 rounded-xl bg-muted/20 border border-white/5 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words shadow-inner">
            {proyecto.documentacion}
          </div>
        </div>
      )}

      {/* Notas */}
      {proyecto.notas && (
        <div className="space-y-3">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
            <StickyNote size={14} /> Notas para el cliente
          </p>
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/10 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words italic">
            {proyecto.notas}
          </div>
        </div>
      )}
    </div>
  );
}
