import React from "react";
import { getFuturoClienteById } from "@/actions/futuros-clientes/get-futuro-cliente-by-id";
import { FuturoClienteDetail } from "@/components/futuros-clientes/FuturoClienteDetail";
import { notFound } from "next/navigation";

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

export default async function FuturoClienteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getFuturoClienteById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4 lg:px-8">
      <FuturoClienteDetail futuroCliente={result.data} variant="admin" />
    </main>
  );
}