"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { User } from "@/interface/user";
import { getClienteById } from "@/actions/clientes/get-cliente-by-id";
import { ClienteDetailView } from "@/components/clientes/ClienteDetailView";
import { ClienteEditForm } from "@/components/clientes/ClienteEditForm";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ClienteDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [cliente, setCliente] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchCliente = async () => {
    try {
      const result = await getClienteById(id);
      if (result.success && result.data) {
        setCliente(result.data);
      } else {
        toast.error(result.error || "Cliente no encontrado");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Cargando cliente...</p>
      </div>
    );
  }

  if (!cliente) return null;

  return (
    <>
      <ClienteDetailView
        cliente={cliente}
        onEdit={() => setIsEditOpen(true)}
      />

      <ClienteEditForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        cliente={cliente}
        onSuccess={fetchCliente}
      />
    </>
  );
}
