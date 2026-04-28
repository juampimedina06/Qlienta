import React from "react";
import { ProyectosList } from "@/components/proyectos/ProyectosList";

export const metadata = {
  title: "Proyectos | Administrador",
  description: "Gestión de proyectos de la plataforma.",
};

export default function AdminProyectosPage() {
  return (
    <div className="space-y-6">
      <ProyectosList />
    </div>
  );
}
