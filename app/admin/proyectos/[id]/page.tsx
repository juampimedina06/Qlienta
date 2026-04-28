"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Proyecto } from "@/interface/proyecto";
import { getProyectoById } from "@/actions/proyectos/get-proyecto-by-id";
import { ProyectoDetail } from "@/components/proyectos/ProyectoDetail";
import { DarAltaClienteForm } from "@/components/proyectos/DarAltaClienteForm";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProyectoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAltaOpen, setIsAltaOpen] = useState(false);

  const fetchProyecto = async () => {
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
  };

  useEffect(() => {
    fetchProyecto();
  }, [id]);

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
    <>
      <ProyectoDetail
        proyecto={proyecto}
        variant="admin"
        onDarAlta={() => setIsAltaOpen(true)}
      />

      <DarAltaClienteForm
        isOpen={isAltaOpen}
        onClose={() => setIsAltaOpen(false)}
        proyectoId={proyecto.id}
        proyectoNombre={proyecto.nombre_proyecto}
        onSuccess={fetchProyecto}
      />
    </>
  );
}
