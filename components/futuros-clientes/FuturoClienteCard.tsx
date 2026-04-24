import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  Trash2,
  Eye,
  Maximize2,
  MapPin,
  Phone,
  Mail,
  Tag,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { FuturoCliente } from "@/interface/futuro-cliente";

interface FuturoClienteCardProps {
  futuroCliente: FuturoCliente;
  onEdit: (futuroCliente: FuturoCliente) => void;
  onDelete: (futuroCliente: FuturoCliente) => void;
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
}: FuturoClienteCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLogoOpen, setIsLogoOpen] = useState(false);

  const estado =
    estadoConfig[futuroCliente.estado] || estadoConfig["en creacion"];

  return (
    <>
      <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm flex flex-row md:flex-col h-auto md:h-full ring-1 ring-border/50 hover:ring-primary/20">
        <div className="flex flex-col flex-1 min-w-0">
          <CardHeader>
            {/* Estado + Logo */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <Badge
                className={cn(
                  "flex items-center gap-1 px-1.5 py-0 text-[9px] uppercase font-bold",
                  estado.color,
                )}
              >
                {estado.label}
              </Badge>
            </div>

            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Tag size={18} className="text-muted-foreground" />
                <div>
                  <p className="text-xs opacity-50">Categoría</p>
                  <p className="text-sm">{futuroCliente.categoria}</p>
                </div>
              </div>

              {futuroCliente.logo_negocio && (
                <button
                  onClick={() => setIsLogoOpen(true)}
                  className="relative group/img overflow-hidden rounded-full focus:outubicacione-none"
                >
                  <Image
                    src={futuroCliente.logo_negocio}
                    alt={futuroCliente.nombre_negocio}
                    width={100}
                    height={100}
                    loading="eager"
                    className="object-cover w-14 h-14 transition-transform duration-300 group-hover/img:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <Maximize2 size={16} className="text-white" />
                  </div>
                </button>
              )}

              {/* Placeholder si no hay logo */}
              {!futuroCliente.logo_negocio && (
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center ring-1 ring-border/50">
                  <Building2 size={22} className="text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Nombre negocio */}
            <CardTitle className="text-sm md:text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
              {futuroCliente.nombre_negocio}
            </CardTitle>

            {/* Contacto */}
            <div className="space-y-1 mt-1 gap-2 flex flex-col mb-2">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={futuroCliente.ubicacion_negocio}
                className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5 truncate hover:text-sky-500 underline"
              >
                <MapPin size={11} className="shrink-0 opacity-60" />
                {futuroCliente.ubicacion_negocio}
              </a>
              <p className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                <Mail size={11} className="shrink-0 opacity-60" />
                {futuroCliente.email_contacto}
              </p>
            </div>
          </CardHeader>

          <CardFooter className="p-3 md:p-4 pt-2 md:pt-0 border-t border-border/10 mt-auto flex items-center justify-between gap-2">
            <div className="flex items-center text-[10px] text-muted-foreground font-medium truncate">
              <Calendar size={12} className="mr-1 opacity-70 shrink-0" />
              {format(futuroCliente.created_at, "d MMM", { locale: es })}
            </div>

            <div className="flex items-center gap-0.5 md:gap-1">
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
                onClick={() => onEdit(futuroCliente)}
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:h-7 md:w-7 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-colors"
                onClick={() => onDelete(futuroCliente)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </CardFooter>
        </div>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent
          className={cn(
            "w-[100vw] max-h-[90vh] overflow-y-auto",
            futuroCliente.logo_negocio ? "max-w-3xl" : "max-w-xl",
          )}
        >
          <DialogHeader className="pb-4 border-b border-white/10">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
                Detalles del Prospecto
              </p>
              <DialogTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                {futuroCliente.nombre_negocio}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div
            className={cn(
              "grid grid-cols-1 gap-8 py-6",
              futuroCliente.logo_negocio ? "md:grid-cols-[1fr_240px]" : "",
            )}
          >
            {/* Main Content */}
            <div className="space-y-8 min-w-0">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
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
                    Categoría
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Tag size={14} className="text-primary" />
                    {futuroCliente.categoria}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest shrink-0">
                    Información de Contacto
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-l from-white/10 to-transparent" />
                </div>

                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-bold">
                          Responsable
                        </p>
                        <p className="text-sm font-medium truncate">
                          {futuroCliente.nombre_contacto}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-bold">
                          Email
                        </p>
                        <p className="text-sm font-medium truncate hover:text-primary transition-colors cursor-pointer">
                          {futuroCliente.email_contacto}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                        <Phone size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-bold">
                          Teléfono
                        </p>
                        <p className="text-sm font-medium">
                          {futuroCliente.telefono_contacto || "No especificado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground font-bold">
                          Ubicación
                        </p>
                        <p className="text-sm font-medium italic">
                          {futuroCliente.ubicacion_negocio}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions Section */}
              <div className="space-y-6">
                {futuroCliente.informacion_negocio && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                      Descripción del Negocio
                    </p>
                    <div className="p-4 rounded-xl bg-muted/20 border border-white/5 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words shadow-inner">
                      {futuroCliente.informacion_negocio}
                    </div>
                  </div>
                )}

                {futuroCliente.notas_internas && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                      Notas Internas
                    </p>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-sm leading-relaxed text-muted-foreground/90 whitespace-pre-wrap break-words italic">
                      {futuroCliente.notas_internas}
                    </div>
                  </div>
                )}

                {futuroCliente.estado === "rechazado" &&
                  futuroCliente.motivo_rechazo && (
                    <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-2">
                      <p className="text-[10px] text-rose-500 uppercase font-black tracking-widest">
                        Motivo de Rechazo
                      </p>
                      <p className="text-sm text-rose-200/80 leading-relaxed">
                        {futuroCliente.motivo_rechazo}
                      </p>
                    </div>
                  )}
              </div>

              {/* Footer info */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 pt-4 border-t border-white/5">
                <Calendar size={12} />
                <span className="uppercase font-medium tracking-tighter">
                  Registro creado el{" "}
                  {format(futuroCliente.created_at, "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
              </div>
            </div>

            {/* Sidebar / Logo */}
            {futuroCliente.logo_negocio && (
              <div className="space-y-4">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest text-center md:text-left">
                  Identidad Visual
                </p>
                <div
                  className="relative group cursor-zoom-in"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsLogoOpen(true);
                  }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-sm group-hover:from-primary/40 transition-all duration-500" />
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-square">
                    <Image
                      src={futuroCliente.logo_negocio}
                      alt={futuroCliente.nombre_negocio}
                      width={400}
                      height={400}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Maximize2 className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Logo fullscreen */}
      <Dialog open={isLogoOpen} onOpenChange={setIsLogoOpen}>
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <DialogContent className="max-w-5xl p-1 bg-transparent border-none shadow-none flex items-center justify-center">
          {futuroCliente.logo_negocio && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={futuroCliente.logo_negocio}
                alt={futuroCliente.nombre_negocio}
                width={1200}
                height={1200}
                className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
