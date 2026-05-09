"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Edit,
  Trash2,
  Maximize2,
  MapPin,
  Phone,
  Mail,
  Tag,
  Building2,
  ExternalLink,
  ArrowLeft,
  UserPlus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FuturoCliente } from "@/interface/futuro-cliente";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FuturoClienteDetailProps {
  futuroCliente: FuturoCliente;
  onEdit?: (futuroCliente: FuturoCliente) => void;
  onDelete?: (futuroCliente: FuturoCliente) => void;
  onDarAlta?: (futuroCliente: FuturoCliente) => void;
  backUrl?: string;
  variant?: "admin" | "empleado";
}

const estadoConfig = {
  "en creacion": {
    color: "bg-muted/50 text-muted-foreground border-border",
    colorDark: "bg-zinc-800 text-zinc-400 border-zinc-700",
    label: "Draft",
  },
  creado: {
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    colorDark: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    label: "Nuevo",
  },
  aceptado: {
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    colorDark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Aceptado",
  },
  rechazado: {
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    colorDark: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    label: "Rechazado",
  },
};

export function FuturoClienteDetail({
  futuroCliente,
  onEdit,
  onDelete,
  onDarAlta,
  variant,
}: FuturoClienteDetailProps) {
  const [isLogoOpen, setIsLogoOpen] = useState(false);
  const router = useRouter();
  const isEmpleado = variant === "empleado";

  const getFallbackUrl = () => {
    if (!variant) return "/";
    if (variant === "admin") return "/admin/futurosClientes";
    if (variant === "empleado") return "/empleado";
    return "/";
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(getFallbackUrl());
    }
  };

  const estado =
    estadoConfig[futuroCliente.estado] || estadoConfig["en creacion"];

  return (
    <div
      className={cn(
        "max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ",
        isEmpleado && "text-zinc-100",
      )}
    >
      {/* Header con navegación */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className={cn(
            "gap-2 transition-colors",
            isEmpleado
              ? "text-zinc-500 hover:text-white hover:bg-zinc-900"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeft size={16} />
          Volver a la lista
        </Button>

        <div className="flex items-center gap-2">
          {onDarAlta &&
            (futuroCliente.estado === "aceptado" ||
              futuroCliente.estado === "creado") && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2 font-bold uppercase tracking-widest text-[10px]",
                  isEmpleado
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500 hover:text-black transition-all"
                    : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10",
                )}
                onClick={() => onDarAlta(futuroCliente)}
              >
                <UserPlus size={14} />
                Dar de alta
              </Button>
            )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 font-bold uppercase tracking-widest text-[10px]",
                isEmpleado &&
                  "border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300",
              )}
              onClick={() => onEdit(futuroCliente)}
            >
              <Edit size={14} />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 font-bold uppercase tracking-widest text-[10px]",
                isEmpleado
                  ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                  : "text-rose-600 hover:text-rose-700 hover:bg-rose-50",
              )}
              onClick={() => onDelete(futuroCliente)}
            >
              <Trash2 size={14} />
              Eliminar
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                className={cn(
                  "px-3 py-0.5 text-[10px] uppercase font-black tracking-widest border",
                  isEmpleado ? estado.colorDark : estado.color,
                )}
              >
                {estado.label}
              </Badge>
              <div
                className={cn(
                  "flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight",
                  isEmpleado ? "text-zinc-500" : "text-muted-foreground",
                )}
              >
                <Tag size={14} className="text-emerald-500" />
                {futuroCliente.categoria}
              </div>
            </div>

            <h1
              className={cn(
                "text-4xl md:text-5xl font-black tracking-tight",
                isEmpleado
                  ? "text-white"
                  : "bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent",
              )}
            >
              {futuroCliente.nombre_negocio}
            </h1>
          </div>

          {/* Contact Information Card */}
          <div
            className={cn(
              "p-6 md:p-8 rounded-[2rem] border shadow-sm space-y-8 ",
              isEmpleado
                ? "bg-zinc-900/40 border-zinc-800 shadow-2xl"
                : "bg-card border-border/50",
            )}
          >
            <div className="flex items-center gap-3 ">
              <p
                className={cn(
                  "text-[10px] uppercase font-black tracking-[0.3em] shrink-0",
                  isEmpleado ? "text-emerald-500/70" : "text-muted-foreground",
                )}
              >
                Datos de Contacto
              </p>
              <div
                className={cn(
                  "h-px flex-1",
                  isEmpleado ? "bg-zinc-800" : "bg-border/50",
                )}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl",
                      isEmpleado
                        ? "bg-zinc-950 border border-zinc-800 text-zinc-100"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <Building2 size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-1">
                      Responsable Directo
                    </p>
                    <p className="text-lg font-bold tracking-tight">
                      {futuroCliente.nombre_contacto}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl",
                      isEmpleado
                        ? "bg-zinc-950 border border-zinc-800 text-zinc-100"
                        : "bg-blue-500/10 text-blue-500",
                    )}
                  >
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-1">
                      Canal de Email
                    </p>
                    <p className="text-lg font-bold tracking-tight">
                      {futuroCliente.email_contacto}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl",
                      isEmpleado
                        ? "bg-zinc-950 border border-zinc-800 text-zinc-100"
                        : "bg-emerald-500/10 text-emerald-500",
                    )}
                  >
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-1">
                      Línea Telefónica
                    </p>
                    <p className="text-lg font-bold tracking-tight">
                      {futuroCliente.telefono_contacto || "Sin registrar"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-2xl",
                      isEmpleado
                        ? "bg-zinc-950 border border-zinc-800 text-zinc-100"
                        : "bg-amber-500/10 text-amber-500",
                    )}
                  >
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-wider mb-1">
                      Geo-Localización
                    </p>
                    <a
                      href={futuroCliente.ubicacion_negocio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "text-lg font-bold tracking-tight hover:underline cursor-pointer flex items-center gap-2",
                        isEmpleado ? "text-emerald-400" : "text-sky-600",
                      )}
                    >
                      Navegar en Mapas <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="grid gap-10">
            {futuroCliente.informacion_negocio && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em]",
                      isEmpleado ? "text-zinc-500" : "text-muted-foreground",
                    )}
                  >
                    Reporte del Negocio
                  </h3>
                  <div
                    className={cn(
                      "h-px flex-1",
                      isEmpleado ? "bg-zinc-900" : "bg-border/50",
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "p-8 rounded-[2rem] border text-base leading-relaxed whitespace-pre-wrap font-medium",
                    isEmpleado
                      ? "bg-zinc-900/20 border-zinc-800 text-zinc-300"
                      : "bg-muted/30 border-border/50",
                  )}
                >
                  {futuroCliente.informacion_negocio}
                </div>
              </div>
            )}

            {futuroCliente.notas_internas && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.2em]",
                      isEmpleado
                        ? "text-emerald-500/50"
                        : "text-muted-foreground",
                    )}
                  >
                    Bitácora Interna
                  </h3>
                  <div
                    className={cn(
                      "h-px flex-1",
                      isEmpleado ? "bg-zinc-900" : "bg-border/50",
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "p-8 rounded-[2rem] border italic font-medium",
                    isEmpleado
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                      : "bg-primary/5 border-primary/10 text-muted-foreground",
                  )}
                >
                  {futuroCliente.notas_internas}
                </div>
              </div>
            )}

            {futuroCliente.proyecto_desplegado && (
              <div
                className={cn(
                  "group p-6 md:p-8 rounded-[2.5rem] border space-y-6 transition-all",
                  isEmpleado
                    ? "border-emerald-500/20 bg-zinc-900/40 hover:border-emerald-500/40 shadow-2xl"
                    : "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.3em]",
                      isEmpleado ? "text-emerald-400" : "text-emerald-600",
                    )}
                  >
                    Render del Proyecto Activo
                  </h3>
                  <Sparkles
                    size={16}
                    className="text-emerald-500/50 animate-pulse"
                  />
                </div>

                {/* Preview */}
                <a
                  href={futuroCliente.proyecto_desplegado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-[2rem] border border-zinc-800 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all relative group/img"
                >
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity z-10" />
                  <Image
                    width={1200}
                    height={800}
                    src={`https://api.microlink.io/?url=${encodeURIComponent(
                      futuroCliente.proyecto_desplegado,
                    )}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt="preview"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </a>
              </div>
            )}

            {futuroCliente.estado === "rechazado" &&
              futuroCliente.motivo_rechazo && (
                <div
                  className={cn(
                    "p-8 rounded-[2rem] border space-y-4 shadow-xl",
                    isEmpleado
                      ? "border-rose-500/20 bg-rose-500/5"
                      : "border-rose-500/20 bg-rose-500/5",
                  )}
                >
                  <h3
                    className={cn(
                      "text-sm font-black uppercase tracking-widest",
                      isEmpleado ? "text-rose-400" : "text-rose-500",
                    )}
                  >
                    Reporte de Cancelación
                  </h3>
                  <p
                    className={cn(
                      "text-lg font-medium leading-relaxed",
                      isEmpleado ? "text-rose-300/80" : "text-rose-600/90",
                    )}
                  >
                    {futuroCliente.motivo_rechazo}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Sidebar / Logo */}
        <div className="space-y-8">
          {futuroCliente.logo_negocio ? (
            <div className="space-y-4">
              <h3
                className={cn(
                  "text-xs font-black uppercase tracking-[0.2em]",
                  isEmpleado ? "text-zinc-500" : "text-muted-foreground",
                )}
              >
                Identidad de Marca
              </h3>
              <div
                className={cn(
                  "relative group cursor-zoom-in rounded-[2rem] overflow-hidden border shadow-2xl aspect-square transition-all",
                  isEmpleado
                    ? "bg-white border-zinc-800 group-hover:border-emerald-500/50"
                    : "bg-white border-border/50",
                )}
                onClick={() => setIsLogoOpen(true)}
              >
                <Image
                  src={futuroCliente.logo_negocio}
                  alt={futuroCliente.nombre_negocio}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full p-8 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <Maximize2 className="text-white" size={24} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "aspect-square rounded-[2rem] flex items-center justify-center border-2 border-dashed",
                isEmpleado
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-muted border-border/50",
              )}
            >
              <Building2
                size={48}
                className={cn(
                  isEmpleado ? "text-zinc-800" : "text-muted-foreground/50",
                )}
              />
            </div>
          )}

          <div
            className={cn(
              "p-8 rounded-[2rem] border space-y-6 shadow-xl",
              isEmpleado
                ? "bg-zinc-900/40 border-zinc-800"
                : "bg-muted/20 border-border/50",
            )}
          >
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Registro de Ingreso
              </span>
              <div className="flex items-center gap-3 font-bold text-sm">
                <Calendar size={16} className="text-emerald-500" />
                <span>
                  {format(
                    new Date(futuroCliente.created_at),
                    "d 'de' MMMM, yyyy",
                    { locale: es },
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo fullscreen modal */}
      <Dialog open={isLogoOpen} onOpenChange={setIsLogoOpen}>
        <DialogHeader className="hidden">
          <DialogTitle />
        </DialogHeader>
        <DialogContent className="max-w-5xl p-1 bg-transparent border-none shadow-none flex items-center justify-center outline-none">
          {futuroCliente.logo_negocio && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={futuroCliente.logo_negocio}
                alt={futuroCliente.nombre_negocio}
                width={1200}
                height={1200}
                className="max-h-[90vh] w-auto object-contain rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-white p-8"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
