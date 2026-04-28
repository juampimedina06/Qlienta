"use client";

import { User } from "@/interface/user";
import { Proyecto } from "@/interface/proyecto";
import { AvatarBadge } from "@/components/AvatarBadge";
import { getImagenUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClientCard } from "@/components/clientes/ClienteCard";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Calendar,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProyectos } from "@/actions/proyectos/get-proyectos";

interface ClienteDetailViewProps {
  cliente: User;
  onEdit?: () => void;
}

export function ClienteDetailView({ cliente, onEdit }: ClienteDetailViewProps) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  useEffect(() => {
    async function fetchProyectos() {
      try {
        // Buscar proyectos de este cliente usando el filtro de search con el ID
        const result = await getProyectos({
          page: 0,
          limit: 50,
        });

        if (result.success && result.data) {
          // Filtrar por cliente_id en el front
          const clienteProyectos = result.data.filter(
            (p) => p.cliente_id === cliente.id,
          );
          setProyectos(clienteProyectos);
        }
      } catch {
        // silencioso
      } finally {
        setLoadingProyectos(false);
      }
    }
    fetchProyectos();
  }, [cliente.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link href="/admin/clientes">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Volver a clientes
          </Button>
        </Link>

        {onEdit && (
          <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
            <Edit size={14} />
            Editar
          </Button>
        )}
      </div>

      {/* Profile section */}
      <div className="p-6 rounded-3xl bg-card border border-border/50 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <AvatarBadge
            name={cliente.name || "Cliente"}
            avatar_url={getImagenUrl(cliente.avatar_url || "")}
            className="h-20 w-20"
          />
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {cliente.name || "Sin nombre"}
            </h1>
            <Badge className="px-3 py-0.5 text-[10px] uppercase font-black bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              Cliente
            </Badge>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Email</p>
              <p className="text-sm font-medium">{cliente.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Teléfono</p>
              <p className="text-sm font-medium">
                {cliente.phone
                  ? `${cliente.country_code || ""} ${cliente.phone}`
                  : "No especificado"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Miembro desde</p>
              <p className="text-sm font-medium">
                {cliente.created_at
                  ? format(new Date(cliente.created_at), "d 'de' MMMM, yyyy", {
                      locale: es,
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proyectos del cliente */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <FolderOpen size={20} className="text-primary" />
          Proyectos del cliente
        </h2>

        {loadingProyectos ? (
          <div className="flex items-center justify-center py-10 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-muted-foreground text-sm">Cargando proyectos...</span>
          </div>
        ) : proyectos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proyectos.map((p) => (
              <ClientCard
                key={p.id}
                proyecto={p}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl border-2 border-dashed border-border/50 bg-muted/20 text-center">
            <FolderOpen size={32} className="mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Este cliente no tiene proyectos asignados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
