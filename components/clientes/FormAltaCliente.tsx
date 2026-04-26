"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { createProyecto } from "@/actions/proyectos/create-proyecto";
import { updateProyecto } from "@/actions/proyectos/update-proyecto";
import { Proyecto, EstadoPagina } from "@/interface/proyecto";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Schema ---

const proyectoSchema = z.object({
  nombre_proyecto: z.string().min(1, "El nombre es requerido"),
  cliente_id: z.string().uuid("Seleccioná un cliente válido"),
  documentacion: z.string().optional(),
  link_pagina: z.string().url("URL inválida").optional().or(z.literal("")),
  estado_pagina: z.enum([
    "en desarrollo",
    "en revision",
    "publicado",
    "pausado",
    "cancelado",
  ] as const),
  precio: z.coerce.number().min(0).optional(),
  pago_mensual: z.coerce.number().min(0).optional(),
  fecha_proximo_pago: z.string().optional(),
  pagado: z.boolean(),
  tecnologias: z.string().optional(), // se parsea a string[]
  fecha_entrega: z.string().optional(),
  notas: z.string().optional(),
  futuro_cliente_id: z.string().optional(),
});

type ProyectoFormValues = z.infer<typeof proyectoSchema>;

interface FormAltaClienteProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  onSuccess: () => void;
  // Lista de clientes para el select
  clientes: { id: string; full_name: string | null; email: string | null }[];
}

export function FormAltaCliente({
  isOpen,
  onClose,
  proyecto,
  onSuccess,
  clientes,
}: FormAltaClienteProps) {
  const [loading, setLoading] = useState(false);
  const [tecInput, setTecInput] = useState("");
  const [tecnologias, setTecnologias] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProyectoFormValues>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      nombre_proyecto: "",
      cliente_id: "",
      documentacion: "",
      link_pagina: "",
      estado_pagina: "en desarrollo",
      precio: undefined,
      pago_mensual: undefined,
      fecha_proximo_pago: "",
      pagado: false,
      fecha_entrega: "",
      notas: "",
      futuro_cliente_id: "",
    },
  });

  const estadoValue = watch("estado_pagina");
  const clienteValue = watch("cliente_id");
  const pagadoValue = watch("pagado");

  useEffect(() => {
    if (proyecto) {
      reset({
        nombre_proyecto: proyecto.nombre_proyecto,
        cliente_id: proyecto.cliente_id,
        documentacion: proyecto.documentacion || "",
        link_pagina: proyecto.link_pagina || "",
        estado_pagina: proyecto.estado_pagina,
        precio: proyecto.precio ?? undefined,
        pago_mensual: proyecto.pago_mensual ?? undefined,
        fecha_proximo_pago: proyecto.fecha_proximo_pago || "",
        pagado: proyecto.pagado,
        fecha_entrega: proyecto.fecha_entrega || "",
        notas: proyecto.notas || "",
        futuro_cliente_id: proyecto.futuro_cliente_id || "",
      });
      setTecnologias(proyecto.tecnologias || []);
    } else {
      reset({
        nombre_proyecto: "",
        cliente_id: "",
        documentacion: "",
        link_pagina: "",
        estado_pagina: "en desarrollo",
        precio: undefined,
        pago_mensual: undefined,
        fecha_proximo_pago: "",
        pagado: false,
        fecha_entrega: "",
        notas: "",
        futuro_cliente_id: "",
      });
      setTecnologias([]);
    }
    setTecInput("");
  }, [proyecto, reset, isOpen]);

  const addTecnologia = () => {
    const val = tecInput.trim();
    if (val && !tecnologias.includes(val)) {
      setTecnologias((prev) => [...prev, val]);
    }
    setTecInput("");
  };

  const removeTecnologia = (tech: string) => {
    setTecnologias((prev) => prev.filter((t) => t !== tech));
  };

  const onSubmit = async (data: ProyectoFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("nombre_proyecto", data.nombre_proyecto);
      formData.append("cliente_id", data.cliente_id);
      formData.append("documentacion", data.documentacion || "");
      formData.append("link_pagina", data.link_pagina || "");
      formData.append("estado_pagina", data.estado_pagina);
      formData.append("precio", data.precio?.toString() || "");
      formData.append("pago_mensual", data.pago_mensual?.toString() || "");
      formData.append("fecha_proximo_pago", data.fecha_proximo_pago || "");
      formData.append("pagado", data.pagado ? "true" : "false");
      formData.append("tecnologias", JSON.stringify(tecnologias));
      formData.append("fecha_entrega", data.fecha_entrega || "");
      formData.append("notas", data.notas || "");
      formData.append("futuro_cliente_id", data.futuro_cliente_id || "");

      let result;
      if (proyecto) {
        formData.append("id", proyecto.id);
        result = await updateProyecto(formData);
      } else {
        result = await createProyecto(formData);
      }

      if (result.success) {
        toast.success(
          proyecto
            ? "Proyecto actualizado correctamente"
            : "Proyecto creado correctamente",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al guardar el proyecto");
      }
    } catch (error) {
      console.error("Error saving proyecto:", error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {proyecto ? "Editar Proyecto" : "Alta de Cliente / Proyecto"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* ── Datos del proyecto ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Proyecto
            </p>

            <div className="space-y-2">
              <Label htmlFor="nombre_proyecto">Nombre del proyecto *</Label>
              <Input
                id="nombre_proyecto"
                {...register("nombre_proyecto")}
                placeholder="Ej: Landing Page Panadería El Trigo"
                disabled={loading}
              />
              {errors.nombre_proyecto && (
                <p className="text-xs text-red-500">
                  {errors.nombre_proyecto.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cliente *</Label>
              <Select
                value={clienteValue}
                onValueChange={(val) => setValue("cliente_id", val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name || c.email || c.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cliente_id && (
                <p className="text-xs text-red-500">
                  {errors.cliente_id.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={estadoValue}
                  onValueChange={(val: EstadoPagina) =>
                    setValue("estado_pagina", val)
                  }
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en desarrollo">En desarrollo</SelectItem>
                    <SelectItem value="en revision">En revisión</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_pagina">Link del sitio</Label>
                <Input
                  id="link_pagina"
                  {...register("link_pagina")}
                  placeholder="https://..."
                  disabled={loading}
                />
                {errors.link_pagina && (
                  <p className="text-xs text-red-500">
                    {errors.link_pagina.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentacion">Documentación técnica</Label>
              <Textarea
                id="documentacion"
                {...register("documentacion")}
                placeholder="Descripción técnica, instrucciones, notas de desarrollo..."
                rows={3}
                disabled={loading}
              />
            </div>
          </section>

          {/* ── Económico ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Datos económicos
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precio">Precio total ($)</Label>
                <Input
                  id="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("precio")}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pago_mensual">Pago mensual ($)</Label>
                <Input
                  id="pago_mensual"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("pago_mensual")}
                  placeholder="0.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_proximo_pago">Próximo pago</Label>
                <Input
                  id="fecha_proximo_pago"
                  type="date"
                  {...register("fecha_proximo_pago")}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_entrega">Fecha de entrega</Label>
                <Input
                  id="fecha_entrega"
                  type="date"
                  {...register("fecha_entrega")}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-white/5">
              <Switch
                id="pagado"
                checked={pagadoValue}
                onCheckedChange={(val) => setValue("pagado", val)}
                disabled={loading}
              />
              <Label htmlFor="pagado" className="cursor-pointer">
                Marcar como pagado
              </Label>
            </div>
          </section>

          {/* ── Tecnologías ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Tecnologías
            </p>
            <div className="flex gap-2">
              <Input
                value={tecInput}
                onChange={(e) => setTecInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTecnologia();
                  }
                }}
                placeholder="Ej: Next.js, Supabase..."
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTecnologia}
                disabled={loading}
              >
                Agregar
              </Button>
            </div>
            {tecnologias.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tecnologias.map((tech) => (
                  <span
                    key={tech}
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTecnologia(tech)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Notas ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Notas
            </p>
            <div className="space-y-2">
              <Label htmlFor="notas">Notas para el cliente</Label>
              <Textarea
                id="notas"
                {...register("notas")}
                placeholder="Información visible para el cliente..."
                rows={3}
                disabled={loading}
              />
            </div>
          </section>

          <DialogFooter className="pt-2">
            <div className="flex justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {proyecto ? "Actualizar" : "Crear proyecto"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
