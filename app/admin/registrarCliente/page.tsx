"use client";

import AuthForm from "@/components/auth/AuthForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";

export default function RegistrarCliente() {
  const [isCliente, setIsCliente] = useState(false);

  const handleSelectChange = (value: string) => {
    setIsCliente(value === "Cliente");
  };
  return (
    <div className="min-h-screen  p-4 md:p-8">
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

        <div
          className={`grid gap-6 ${isCliente ? "md:grid-cols-2" : "max-w-lg mx-auto"}`}
        >
          <div className="bg-card/50 backdrop-blur-md rounded-xl shadow-sm p-6 border border-card/50">
            <AuthForm type="sign-up" />
          </div>

          {isCliente && (
            <div className="bg-card/50 backdrop-blur-md rounded-xl shadow-sm p-6 border border-card/50">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Datos del Cliente
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Completá los datos específicos del cliente
                </p>
              </div>
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-card rounded-lg">
                <p className="text-muted-foreground text-sm">
                  Componente de datos del cliente
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
