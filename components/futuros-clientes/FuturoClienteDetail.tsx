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

export function FuturoClienteDetail({
  futuroCliente,
  onEdit,
  onDelete,
  onDarAlta,
  variant,
}: FuturoClienteDetailProps) {
  const [isLogoOpen, setIsLogoOpen] = useState(false);
  const router = useRouter();

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
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header con navegación */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Volver a la lista
        </Button>

        <div className="flex items-center gap-2">
          {onDarAlta && futuroCliente.estado === "aceptado" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => onDarAlta(futuroCliente)}
            >
              <UserPlus size={14} />
              Dar de alta cliente
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
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
              className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
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
                  "px-3 py-0.5 text-[10px] uppercase font-black tracking-wider",
                  estado.color,
                )}
              >
                {estado.label}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag size={14} className="text-primary" />
                {futuroCliente.categoria}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {futuroCliente.nombre_negocio}
            </h1>
          </div>

          {/* Contact Information Card */}
          <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest shrink-0">
                Información de Contacto
              </p>
              <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">
                      Responsable
                    </p>
                    <p className="text-base font-semibold">
                      {futuroCliente.nombre_contacto}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">
                      Email
                    </p>
                    <p className="text-base font-semibold">
                      {futuroCliente.email_contacto}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">
                      Teléfono
                    </p>
                    <p className="text-base font-semibold">
                      {futuroCliente.telefono_contacto || "No especificado"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">
                      Ubicación
                    </p>
                    <a
                      href={futuroCliente.ubicacion_negocio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold hover:underline text-sky-600 cursor-pointer underline"
                    >
                      Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Descriptions Section */}
          <div className="grid gap-6">
            {futuroCliente.informacion_negocio && (
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Descripción del Negocio
                </h3>
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-base leading-relaxed whitespace-pre-wrap">
                  {futuroCliente.informacion_negocio}
                </div>
              </div>
            )}

            {futuroCliente.notas_internas && (
              <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Notas Internas
                </h3>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-base leading-relaxed italic text-muted-foreground">
                  {futuroCliente.notas_internas}
                </div>
              </div>
            )}

            {futuroCliente.proyecto_desplegado && (
              <div className="group p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4 hover:border-emerald-500/40 transition-all">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  Proyecto Desplegado
                </h3>

                {/* Preview */}
                <a
                  href={futuroCliente.proyecto_desplegado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-xl border hover:shadow-lg transition-all"
                >
                  <Image
                    width={1200}
                    height={800}
                    src={`https://api.microlink.io/?url=${encodeURIComponent(
                      futuroCliente.proyecto_desplegado,
                    )}&screenshot=true&meta=false&embed=screenshot.url`}
                    alt="preview"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </a>

                {/* Link abajo */}
                <a
                  href={futuroCliente.proyecto_desplegado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-emerald-700 font-semibold hover:underline break-words"
                >
                  <ExternalLink size={16} />
                  <span className="line-clamp-2">
                    {futuroCliente.proyecto_desplegado}
                  </span>
                </a>
              </div>
            )}

            {futuroCliente.estado === "rechazado" &&
              futuroCliente.motivo_rechazo && (
                <div className="p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-rose-500">
                    Motivo de Rechazo
                  </h3>
                  <p className="text-base text-rose-600/90 leading-relaxed">
                    {futuroCliente.motivo_rechazo}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Sidebar / Logo */}
        <div className="space-y-6">
          {futuroCliente.logo_negocio ? (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Identidad Visual
              </h3>
              <div
                className="relative group cursor-zoom-in rounded-3xl overflow-hidden border border-border/50 shadow-xl aspect-square bg-white"
                onClick={() => setIsLogoOpen(true)}
              >
                <Image
                  src={futuroCliente.logo_negocio}
                  alt={futuroCliente.nombre_negocio}
                  width={400}
                  height={400}
                  className="object-contain w-full h-full p-4 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="text-white" size={32} />
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square rounded-3xl bg-muted flex items-center justify-center border-2 border-dashed border-border/50">
              <Building2 size={48} className="text-muted-foreground/50" />
            </div>
          )}

          <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={14} />
              <span>
                Creado el{" "}
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

      {/* Logo fullscreen modal */}
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
    </div>
  );
}
