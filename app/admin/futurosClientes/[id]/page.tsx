"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getFuturoClienteById } from "@/actions/futuros-clientes/get-futuro-cliente-by-id";
import { FuturoClienteDetail } from "@/components/futuros-clientes/FuturoClienteDetail";
import { DarAltaFuturoForm } from "@/components/futuros-clientes/DarAltaFuturoForm";
import { FuturoCliente } from "@/interface/futuro-cliente";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FuturoClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [futuroCliente, setFuturoCliente] = useState<FuturoCliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAltaOpen, setIsAltaOpen] = useState(false);

  const fetchData = async () => {
    try {
      const result = await getFuturoClienteById(id);
      if (result.success && result.data) {
        setFuturoCliente(result.data);
      } else {
        toast.error(result.error || "Prospecto no encontrado");
        router.push("/admin/futurosClientes");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando prospecto...</p>
      </div>
    );
  }

  if (!futuroCliente) return null;

  return (
    <main className="container mx-auto py-8 px-4 lg:px-8">
      <FuturoClienteDetail
        futuroCliente={futuroCliente}
        variant="admin"
        onDarAlta={() => setIsAltaOpen(true)}
      />

      <DarAltaFuturoForm
        isOpen={isAltaOpen}
        onClose={() => setIsAltaOpen(false)}
        futuroCliente={futuroCliente}
        onSuccess={() => {
          fetchData();
          router.refresh();
        }}
      />
    </main>
  );
}