"use client";

import { ProyectoForm } from "@/components/proyectos/ProyectoForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CrearProyectoPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/proyectos">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
            Nuevo
          </p>
          <h1 className="text-2xl font-black tracking-tight">Crear Proyecto</h1>
        </div>
      </div>

      <ProyectoForm
        isOpen={true}
        onClose={() => router.push("/admin/proyectos")}
        onSuccess={() => router.push("/admin/proyectos")}
      />
    </div>
  );
}
