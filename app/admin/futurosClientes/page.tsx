import React from "react";
import { FuturosClientesList } from "@/components/futuros-clientes/FuturosClientesList";

export const metadata = {
  title: "Gestión de Prospectos | Administrador",
  description: "Panel de administración de futuros clientes para administradores.",
};

export default function AdminFuturosClientesPage() {
  return (
    <div className="space-y-6">
      <FuturosClientesList />
    </div>
  );
}
