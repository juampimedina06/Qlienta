"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Proyecto } from "@/interface/proyecto";
import { getProyectoById } from "@/actions/proyectos/get-proyecto-by-id";
import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditarProyectoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProyecto() {
      try {
        const result = await getProyectoById(id);
        if (result.success && result.data) {
          setProyecto(result.data);
        } else {
          toast.error(result.error || "Proyecto no encontrado");
          router.push("/admin/proyectos");
        }
      } catch {
        toast.error("Error inesperado");
        router.push("/admin/proyectos");
      } finally {
        setLoading(false);
      }
    }
    fetchProyecto();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando proyecto...</p>
      </div>
    );
  }

  if (!proyecto) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/proyectos/${id}`}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
            Editar Proyecto
          </p>
          <h1 className="text-2xl font-black tracking-tight">{proyecto.nombre_proyecto}</h1>
        </div>
      </div>

      {/* The form opens automatically */}
      <ProyectoForm
        isOpen={true}
        onClose={() => router.push(`/admin/proyectos/${id}`)}
        proyecto={proyecto}
        onSuccess={() => router.push(`/admin/proyectos/${id}`)}
      />
    </div>
  );
}
