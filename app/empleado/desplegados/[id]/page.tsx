import React from "react";
import { getFuturoClienteById } from "@/actions/futuros-clientes/get-futuro-cliente-by-id";
import { FuturoClienteDetail } from "@/components/futuros-clientes/FuturoClienteDetail";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await getFuturoClienteById(id);

  if (!result.success || !result.data) {
    return { title: "Prospecto no encontrado" };
  }

  return {
    title: `${result.data.nombre_negocio} | Detalles del Prospecto`,
    description: `Información detallada del prospecto ${result.data.nombre_negocio}`,
  };
}

export default async function EmpleadoDesplegadoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getFuturoClienteById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4 lg:px-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="-ml-3 gap-2">
          <Link href="/empleado/desplegados">
            <ArrowLeft size={18} />
            Volver a Proyectos Desplegados
          </Link>
        </Button>
      </div>

      <FuturoClienteDetail futuroCliente={result.data} variant="empleado" />
    </main>
  );
}