"use client";

import { useState } from "react";
import { EstadoPagina } from "@/interface/proyecto";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProyectoInlineData {
  nombre_proyecto: string;
  documentacion: string;
  link_pagina: string;
  estado_pagina: EstadoPagina;
  precio: string;
  pago_mensual: string;
  fecha_proximo_pago: string;
  pagado: boolean;
  tecnologias: string[];
  fecha_entrega: string;
  notas: string;
}

interface ProyectoFormInlineProps {
  data: ProyectoInlineData;
  onChange: (data: ProyectoInlineData) => void;
}

const ESTADOS: { value: EstadoPagina; label: string }[] = [
  { value: "en desarrollo", label: "En desarrollo" },
  { value: "en revision", label: "En revisión" },
  { value: "publicado", label: "Publicado" },
  { value: "pausado", label: "Pausado" },
  { value: "cancelado", label: "Cancelado" },
];

export const defaultProyectoData: ProyectoInlineData = {
  nombre_proyecto: "",
  documentacion: "",
  link_pagina: "",
  estado_pagina: "en desarrollo",
  precio: "",
  pago_mensual: "",
  fecha_proximo_pago: "",
  pagado: false,
  tecnologias: [],
  fecha_entrega: "",
  notas: "",
};

export function ProyectoFormInline({ data, onChange }: ProyectoFormInlineProps) {
  const [techInput, setTechInput] = useState("");

  const update = (field: keyof ProyectoInlineData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !data.tecnologias.includes(trimmed)) {
      update("tecnologias", [...data.tecnologias, trimmed]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    update(
      "tecnologias",
      data.tecnologias.filter((t) => t !== tech),
    );
  };

  return (
    <div className="space-y-5">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="inline_nombre_proyecto">Nombre del proyecto *</Label>
        <Input
          id="inline_nombre_proyecto"
          value={data.nombre_proyecto}
          onChange={(e) => update("nombre_proyecto", e.target.value)}
          placeholder="Ej: E-commerce para Tienda X"
        />
      </div>

      {/* Estado + Pagado */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={data.estado_pagina}
            onValueChange={(v) => update("estado_pagina", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Pagado</Label>
          <div className="flex items-center gap-3 h-9 px-3 rounded-md border bg-background">
            <Switch
              checked={data.pagado}
              onCheckedChange={(v) => update("pagado", v)}
            />
            <span className="text-sm text-muted-foreground">
              {data.pagado ? "Sí" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Económico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline_precio">Precio total ($)</Label>
          <Input
            id="inline_precio"
            type="number"
            step="0.01"
            value={data.precio}
            onChange={(e) => update("precio", e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inline_pago_mensual">Pago mensual ($)</Label>
          <Input
            id="inline_pago_mensual"
            type="number"
            step="0.01"
            value={data.pago_mensual}
            onChange={(e) => update("pago_mensual", e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Link y Fechas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inline_link_pagina">Link de la página</Label>
          <Input
            id="inline_link_pagina"
            value={data.link_pagina}
            onChange={(e) => update("link_pagina", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inline_fecha_entrega">Fecha de entrega</Label>
          <Input
            id="inline_fecha_entrega"
            type="date"
            value={data.fecha_entrega}
            onChange={(e) => update("fecha_entrega", e.target.value)}
          />
        </div>
      </div>

      {/* Tecnologías */}
      <div className="space-y-2">
        <Label>Tecnologías</Label>
        <div className="flex gap-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Ej: Next.js"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addTech}>
            <Plus size={16} />
          </Button>
        </div>
        {data.tecnologias.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tecnologias.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="inline_notas">Notas para el cliente</Label>
        <Textarea
          id="inline_notas"
          value={data.notas}
          onChange={(e) => update("notas", e.target.value)}
          placeholder="Notas visibles para el cliente..."
          rows={2}
        />
      </div>
    </div>
  );
}
