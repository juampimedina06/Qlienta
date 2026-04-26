import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  DollarSign,
  Code2,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { format, isPast, isWithinInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Proyecto } from "@/interface/proyecto";

interface ClientCardProps {
  proyecto: Proyecto;
  onEdit: (proyecto: Proyecto) => void;
  onDelete: (proyecto: Proyecto) => void;
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

export function ClientCard({ proyecto, onEdit, onDelete }: ClientCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const estado =
    estadoConfig[proyecto.estado_pagina] || estadoConfig["en desarrollo"];
  const pagoAlerta = getPagoAlerta(proyecto.fecha_proximo_pago);

  return (
    <>
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm flex flex-col h-full ring-1 ring-border/50 hover:ring-primary/20">
        <div className="flex flex-col flex-1 min-w-0">
          <CardHeader>
            {/* Estado */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Badge
                className={cn(
                  "px-1.5 py-0 text-[9px] uppercase font-bold",
                  estado.color,
                )}
              >
                {estado.label}
              </Badge>

              {/* Alerta de pago */}
              {pagoAlerta === "vencido" && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-rose-500 uppercase">
                  <AlertTriangle size={11} /> Vencido
                </span>
              )}
              {pagoAlerta === "proximo" && (
                <span className="flex items-center gap-1 text-[9px] font-bold text-amber-500 uppercase">
                  <Clock size={11} /> Próximo pago
                </span>
              )}
            </div>

            {/* Precio + pagado */}
            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs opacity-50">Precio total</p>
                  <p className="text-sm font-semibold">
                    {proyecto.precio
                      ? `$${proyecto.precio.toLocaleString("es-AR")}`
                      : "—"}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                  proyecto.pagado
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500",
                )}
              >
                <CheckCircle2 size={12} />
                {proyecto.pagado ? "Pagado" : "Pendiente"}
              </div>
            </div>

            {/* Nombre proyecto */}
            <CardTitle className="text-sm md:text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
              {proyecto.nombre_proyecto}
            </CardTitle>

            {/* Cliente + tecnologías */}
            <div className="space-y-1 mt-1">
              {proyecto.cliente?.full_name && (
                <p className="text-[11px] text-muted-foreground truncate">
                  👤 {proyecto.cliente.full_name}
                </p>
              )}
              {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proyecto.tecnologias.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                  {proyecto.tecnologias.length > 3 && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      +{proyecto.tecnologias.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardFooter className="p-3 md:p-4 pt-2 md:pt-0 border-t border-border/10 mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center text-[10px] text-muted-foreground font-medium truncate">
              <Calendar size={12} className="mr-1 opacity-70 shrink-0" />
              {proyecto.fecha_entrega
                ? format(new Date(proyecto.fecha_entrega), "d MMM yyyy", {
                    locale: es,
                  })
                : format(proyecto.created_at, "d MMM", { locale: es })}
            </div>

            <div className="flex items-center gap-0.5 md:gap-1">
              {proyecto.link_pagina && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <a
                    href={proyecto.link_pagina}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setIsDetailsOpen(true)}
              >
                <Eye size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => onEdit(proyecto)}
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors"
                onClick={() => onDelete(proyecto)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-white/10">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
                Detalles del Proyecto
              </p>
              <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                {proyecto.nombre_proyecto}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-8 py-6">
            {/* Estado + pagado */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Estado
                </p>
                <Badge
                  className={cn(
                    "px-2 py-0 text-[10px] uppercase font-black",
                    estado.color,
                  )}
                >
                  {estado.label}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                  Pago
                </p>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-bold",
                    proyecto.pagado ? "text-emerald-500" : "text-rose-500",
                  )}
                >
                  <CheckCircle2 size={13} />
                  {proyecto.pagado ? "Pagado" : "Pendiente"}
                </div>
              </div>
              {proyecto.link_pagina && (
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Sitio
                  </p>
                  <a
                    href={proyecto.link_pagina}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 hover:underline font-medium truncate"
                  >
                    <ExternalLink size={12} /> Ver sitio
                  </a>
                </div>
              )}
            </div>

            {/* Económico */}
            <div className="space-y-3">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                Datos económicos
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-xl bg-muted/20 border border-white/5 space-y-0.5">
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Precio total
                  </p>
                  <p className="text-sm font-semibold">
                    {proyecto.precio
                      ? `$${proyecto.precio.toLocaleString("es-AR")}`
                      : "—"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-white/5 space-y-0.5">
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Pago mensual
                  </p>
                  <p className="text-sm font-semibold">
                    {proyecto.pago_mensual
                      ? `$${proyecto.pago_mensual.toLocaleString("es-AR")}`
                      : "—"}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-xl border space-y-0.5",
                    pagoAlerta === "vencido"
                      ? "bg-rose-500/5 border-rose-500/20"
                      : pagoAlerta === "proximo"
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-muted/20 border-white/5",
                  )}
                >
                  <p className="text-[10px] text-muted-foreground font-bold">
                    Próximo pago
                  </p>
                  <p className="text-sm font-semibold">
                    {proyecto.fecha_proximo_pago
                      ? format(
                          new Date(proyecto.fecha_proximo_pago),
                          "d MMM yyyy",
                          { locale: es },
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tecnologías */}
            {proyecto.tecnologias && proyecto.tecnologias.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Tecnologías
                </p>
                <div className="flex flex-wrap gap-2">
                  {proyecto.tecnologias.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      <Code2 size={11} /> {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              {proyecto.fecha_entrega && (
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    Fecha de entrega
                  </p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar size={13} className="text-muted-foreground" />
                    {format(
                      new Date(proyecto.fecha_entrega),
                      "d 'de' MMMM, yyyy",
                      {
                        locale: es,
                      },
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Documentación */}
            {proyecto.documentacion && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Documentación
                </p>
                <div className="p-4 rounded-xl bg-muted/20 border border-white/5 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words shadow-inner">
                  {proyecto.documentacion}
                </div>
              </div>
            )}

            {/* Notas */}
            {proyecto.notas && (
              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                  Notas para el cliente
                </p>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words italic">
                  {proyecto.notas}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 pt-4 border-t border-white/5">
              <Calendar size={12} />
              <span className="uppercase font-medium tracking-tighter">
                Creado el{" "}
                {format(proyecto.created_at, "d 'de' MMMM, yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
