"use client";

import AuthForm from "@/components/auth/AuthForm";
import {
  ProyectoFormInline,
  ProyectoInlineData,
  defaultProyectoData,
} from "@/components/proyectos/ProyectoFormInline";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProyecto } from "@/actions/proyectos/create-proyecto";
import { toast } from "react-hot-toast";

import React, { useState, useCallback } from "react";

export default function RegistrarCliente() {
  const [isCliente, setIsCliente] = useState(false);
  const [proyectoData, setProyectoData] = useState<ProyectoInlineData>(defaultProyectoData);

  const handleSelectChange = (value: string) => {
    setIsCliente(value === "Cliente");
  };

  const handleUserCreated = useCallback(
    async (userId: string) => {
      if (!isCliente) return;

      // Validar que el nombre del proyecto esté presente
      if (!proyectoData.nombre_proyecto.trim()) {
        toast.error("Completá el nombre del proyecto antes de registrar al cliente");
        return;
      }

      try {
        const result = await createProyecto({
          nombre_proyecto: proyectoData.nombre_proyecto.trim(),
          cliente_id: userId,
          documentacion: proyectoData.documentacion.trim() || null,
          link_pagina: proyectoData.link_pagina.trim() || null,
          estado_pagina: proyectoData.estado_pagina,
          precio: proyectoData.precio ? parseFloat(proyectoData.precio) : null,
          pago_mensual: proyectoData.pago_mensual
            ? parseFloat(proyectoData.pago_mensual)
            : null,
          fecha_proximo_pago: proyectoData.fecha_proximo_pago || null,
          pagado: proyectoData.pagado,
          tecnologias:
            proyectoData.tecnologias.length > 0
              ? proyectoData.tecnologias
              : null,
          fecha_entrega: proyectoData.fecha_entrega || null,
          notas: proyectoData.notas.trim() || null,
        });

        if (result.success) {
          toast.success("Proyecto vinculado al nuevo cliente exitosamente", {
            duration: 3000,
            icon: "🚀",
          });
          // Reset form
          setProyectoData(defaultProyectoData);
        } else {
          toast.error(
            `Usuario creado, pero error al crear proyecto: ${result.error}`,
          );
        }
      } catch {
        toast.error("Usuario creado, pero error inesperado al crear proyecto");
      }
    },
    [isCliente, proyectoData],
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 rounded-xl shadow-sm border border-card/50">
          <h1 className="text-xl font-semibold text-foreground">
            Registrar Nuevo Usuario
          </h1>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">
              Dar de Alta como:
            </span>
            <Select
              value={isCliente ? "Cliente" : "Usuario"}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-40 bg-card/50 border-card/50 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/50 border-card/50">
                <SelectItem
                  value="Usuario"
                  className="text-foreground focus:bg-card focus:text-foreground"
                >
                  Usuario
                </SelectItem>
                <SelectItem
                  value="Cliente"
                  className="text-foreground focus:bg-card focus:text-foreground"
                >
                  Cliente
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isCliente && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-primary">
              <strong>Modo Cliente:</strong> Al registrar el usuario, se creará
              automáticamente el proyecto vinculado con los datos completados a
              la derecha.
            </p>
          </div>
        )}

        <div
          className={`grid gap-6 ${isCliente ? "md:grid-cols-2" : "max-w-lg mx-auto"}`}
        >
          <div className="bg-card/50 backdrop-blur-md rounded-xl shadow-sm p-6 border border-card/50">
            <AuthForm
              type="sign-up"
              onUserCreated={isCliente ? handleUserCreated : undefined}
            />
          </div>

          {isCliente && (
            <div className="bg-card/50 backdrop-blur-md rounded-xl shadow-sm p-6 border border-card/50">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Datos del Proyecto
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Completá los datos del proyecto para el nuevo cliente
                </p>
              </div>
              <ProyectoFormInline
                data={proyectoData}
                onChange={setProyectoData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
