"use client";

import { useState } from "react";
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
  Key,
  Eye,
  EyeOff,
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

export function ProyectoDetail({
  proyecto,
  variant = "admin",
  onDarAlta,
}: ProyectoDetailProps) {
  const estado =
    estadoConfig[proyecto.estado_pagina] || estadoConfig["en desarrollo"];
  const pagoAlerta = getPagoAlerta(proyecto.fecha_proximo_pago);
  const isAdmin = variant === "admin";
  const [showCredentials, setShowCredentials] = useState(false);
  const canDarAlta = isAdmin && !proyecto.cliente_id;

  return (
    <div className="space-y-12">
      {/* Header & Status Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center justify-between">
        <div className="flex items-center gap-5">
          {isAdmin && (
            <Link href="/admin/proyectos">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white shadow-sm ring-1 ring-stone-200"
              >
                <ArrowLeft size={18} />
              </Button>
            </Link>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={cn(
                  "px-2 py-0.5 text-[9px] uppercase font-black tracking-widest rounded-md border",
                  estado.color,
                )}
              >
                {estado.label}
              </span>
              {pagoAlerta && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-[9px] uppercase font-black tracking-widest rounded-md border",
                    pagoAlerta === "vencido"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  )}
                >
                  Pago {pagoAlerta === "vencido" ? "Vencido" : "Próximo"}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-stone-900">
              {proyecto.nombre_proyecto}
            </h1>
          </div>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-3">
            {canDarAlta && (
              <Button
                onClick={onDarAlta}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-bold"
              >
                <UserPlus size={16} className="mr-2" />
                Dar de alta
              </Button>
            )}
            <Link href={`/admin/proyectos/${proyecto.id}/editar`}>
              <Button
                variant="outline"
                className="rounded-2xl font-bold border-stone-200"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
            </Link>
          </div>
        ) : (
          proyecto.link_pagina && (
            <a
              href={proyecto.link_pagina}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-95"
            >
              <ExternalLink size={16} />
              VISITAR SITIO WEB
            </a>
          )
        )}
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl shadow-stone-200/50 ring-1 ring-stone-100 transition-all hover:shadow-stone-300/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <DollarSign size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Presupuesto Total
          </p>
          <p className="mt-1 text-2xl font-black text-stone-900">
            {proyecto.precio
              ? `$${proyecto.precio.toLocaleString("es-AR")}`
              : "—"}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                proyecto.pagado ? "bg-emerald-500" : "bg-rose-500",
              )}
            />
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              {proyecto.pagado ? "Totalmente Abonado" : "Pendiente de Cobro"}
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl shadow-stone-200/50 ring-1 ring-stone-100 transition-all hover:shadow-stone-300/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Cuota Mensual
          </p>
          <p className="mt-1 text-2xl font-black text-stone-900">
            {proyecto.pago_mensual
              ? `$${proyecto.pago_mensual.toLocaleString("es-AR")}`
              : "—"}
          </p>
          <div className="mt-4 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            Próximo vencimiento:{" "}
            <span className="text-stone-900">
              {proyecto.fecha_proximo_pago
                ? format(new Date(proyecto.fecha_proximo_pago), "d MMM yyyy", {
                    locale: es,
                  })
                : "—"}
            </span>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl shadow-stone-200/50 ring-1 ring-stone-100 transition-all hover:shadow-stone-300/50">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <Calendar size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            Fecha de Entrega
          </p>
          <p className="mt-1 text-2xl font-black text-stone-900">
            {proyecto.fecha_entrega
              ? format(new Date(proyecto.fecha_entrega), "d MMM yyyy", {
                  locale: es,
                })
              : "Finalizando..."}
          </p>
          <div className="mt-4 text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            Creado el:{" "}
            <span className="text-stone-900">
              {format(new Date(proyecto.created_at), "d MMM yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Info & Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Credentials & Details */}
        <div className="space-y-8">
          {/* Credentials Glass Card */}
          <div className="rounded-[2rem] bg-stone-900 p-8 shadow-2xl shadow-black/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Key size={80} className="text-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Credenciales de Acceso
                  </h3>
                  <p className="text-[10px] text-stone-400 uppercase font-bold tracking-[0.2em]">
                    Seguridad & Autenticación
                  </p>
                </div>
                <button
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest transition-all hover:bg-white/20 active:scale-95"
                >
                  {showCredentials ? (
                    <>
                      <EyeOff size={14} /> Ocultar
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> Revelar
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {proyecto.tecnologias && proyecto.tecnologias.length > 0 ? (
                  proyecto.tecnologias.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-mono text-stone-300"
                    >
                      <Code2 size={14} className="text-blue-400" />
                      {showCredentials ? tech : "••••••••••••"}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-stone-500 italic">
                    No hay credenciales registradas aún.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Documentation Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <FileText size={18} className="text-blue-600" />
              <h3 className="text-lg font-black text-stone-900">
                Documentación del Proyecto
              </h3>
            </div>
            <div className="rounded-[2rem] bg-white p-8 ring-1 ring-stone-100 shadow-xl shadow-stone-200/40">
              {proyecto.documentacion ? (
                <div className="text-sm leading-relaxed text-stone-600 whitespace-pre-wrap font-medium italic">
                  "{proyecto.documentacion}"
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-stone-400">
                  <FileText size={32} className="mb-2 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Sin documentación cargada
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Support */}
        <div className="space-y-8">
          {/* Client Notes Card */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <StickyNote size={18} className="text-amber-500" />
              <h3 className="text-lg font-black text-stone-900">
                Notas para vos
              </h3>
            </div>
            <div className="rounded-[2rem] bg-amber-50/30 p-8 border border-amber-100/50 shadow-xl shadow-amber-500/5">
              {proyecto.notas ? (
                <div className="text-sm leading-relaxed text-stone-700 whitespace-pre-wrap font-bold italic">
                  {proyecto.notas}
                </div>
              ) : (
                <p className="text-xs text-stone-400 font-medium italic">
                  El equipo no ha dejado notas por ahora.
                </p>
              )}
            </div>
          </div>

          {/* Help Banner - Premium CTA */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-2xl shadow-blue-500/30">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">
                  ¿Necesitás asistencia técnica?
                </h3>
                <p className="text-sm font-medium text-blue-100/80 leading-relaxed">
                  Nuestro equipo de ingeniería está disponible para ayudarte con
                  cualquier duda o integración.
                </p>
              </div>
              <a
                href="https://wa.me/543516598216"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit rounded-2xl bg-white px-6 py-3 text-xs font-black text-blue-600 shadow-xl transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 uppercase tracking-widest"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
