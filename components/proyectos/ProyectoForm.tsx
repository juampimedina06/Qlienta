"use client";

import { useState, useEffect } from "react";
import { Proyecto, EstadoPagina } from "@/interface/proyecto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createProyecto } from "@/actions/proyectos/create-proyecto";
import { updateProyecto } from "@/actions/proyectos/update-proyecto";
import { toast } from "react-hot-toast";
import { Loader2, X, Plus } from "lucide-react";

interface ProyectoFormProps {
  isOpen: boolean;
  onClose: () => void;
  proyecto?: Proyecto | null;
  onSuccess: () => void;
  defaultClienteId?: string | null;
  defaultFuturoClienteId?: string | null;
}

const ESTADOS: { value: EstadoPagina; label: string }[] = [
  { value: "en desarrollo", label: "En desarrollo" },
  { value: "en revision", label: "En revisión" },
  { value: "publicado", label: "Publicado" },
  { value: "pausado", label: "Pausado" },
  { value: "cancelado", label: "Cancelado" },
];

export function ProyectoForm({
  isOpen,
  onClose,
  proyecto,
  onSuccess,
  defaultClienteId,
  defaultFuturoClienteId,
}: ProyectoFormProps) {
  const isEditing = !!proyecto;
  const [loading, setLoading] = useState(false);

  // Form state
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [documentacion, setDocumentacion] = useState("");
  const [linkPagina, setLinkPagina] = useState("");
  const [estadoPagina, setEstadoPagina] = useState<EstadoPagina>("en desarrollo");
  const [precio, setPrecio] = useState("");
  const [pagoMensual, setPagoMensual] = useState("");
  const [fechaProximoPago, setFechaProximoPago] = useState("");
  const [pagado, setPagado] = useState(false);
  const [tecnologias, setTecnologias] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [notas, setNotas] = useState("");

  // Reset form on open/close
  useEffect(() => {
    if (isOpen && proyecto) {
      setNombreProyecto(proyecto.nombre_proyecto);
      setDocumentacion(proyecto.documentacion || "");
      setLinkPagina(proyecto.link_pagina || "");
      setEstadoPagina(proyecto.estado_pagina);
      setPrecio(proyecto.precio?.toString() || "");
      setPagoMensual(proyecto.pago_mensual?.toString() || "");
      setFechaProximoPago(proyecto.fecha_proximo_pago || "");
      setPagado(proyecto.pagado);
      setTecnologias(proyecto.tecnologias || []);
      setFechaEntrega(proyecto.fecha_entrega || "");
      setNotas(proyecto.notas || "");
    } else if (isOpen) {
      setNombreProyecto("");
      setDocumentacion("");
      setLinkPagina("");
      setEstadoPagina("en desarrollo");
      setPrecio("");
      setPagoMensual("");
      setFechaProximoPago("");
      setPagado(false);
      setTecnologias([]);
      setFechaEntrega("");
      setNotas("");
    }
  }, [isOpen, proyecto]);

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !tecnologias.includes(trimmed)) {
      setTecnologias((prev) => [...prev, trimmed]);
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setTecnologias((prev) => prev.filter((t) => t !== tech));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProyecto.trim()) {
      toast.error("El nombre del proyecto es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const projectData = {
        nombre_proyecto: nombreProyecto.trim(),
        documentacion: documentacion.trim() || null,
        link_pagina: linkPagina.trim() || null,
        estado_pagina: estadoPagina,
        precio: precio ? parseFloat(precio) : null,
        pago_mensual: pagoMensual ? parseFloat(pagoMensual) : null,
        fecha_proximo_pago: fechaProximoPago || null,
        pagado,
        tecnologias: tecnologias.length > 0 ? tecnologias : null,
        fecha_entrega: fechaEntrega || null,
        notas: notas.trim() || null,
        cliente_id: defaultClienteId || proyecto?.cliente_id || null,
        futuro_cliente_id: defaultFuturoClienteId || proyecto?.futuro_cliente_id || null,
      };

      let result;
      if (isEditing && proyecto) {
        result = await updateProyecto({ id: proyecto.id, ...projectData });
      } else {
        result = await createProyecto(projectData);
      }

      if (result.success) {
        toast.success(isEditing ? "Proyecto actualizado" : "Proyecto creado");
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Error al guardar el proyecto");
      }
    } catch {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-white/10">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">
              {isEditing ? "Editar" : "Nuevo"} Proyecto
            </p>
            <DialogTitle className="text-2xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              {isEditing ? proyecto?.nombre_proyecto : "Crear Proyecto"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre_proyecto">Nombre del proyecto *</Label>
            <Input
              id="nombre_proyecto"
              value={nombreProyecto}
              onChange={(e) => setNombreProyecto(e.target.value)}
              placeholder="Ej: E-commerce para Tienda X"
              required
            />
          </div>

          {/* Estado + Pagado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={estadoPagina}
                onValueChange={(v) => setEstadoPagina(v as EstadoPagina)}
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
                  checked={pagado}
                  onCheckedChange={setPagado}
                />
                <span className="text-sm text-muted-foreground">
                  {pagado ? "Sí" : "No"}
                </span>
              </div>
            </div>
          </div>

          {/* Económico */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio">Precio total ($)</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pago_mensual">Pago mensual ($)</Label>
              <Input
                id="pago_mensual"
                type="number"
                step="0.01"
                value={pagoMensual}
                onChange={(e) => setPagoMensual(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_proximo_pago">Próximo pago</Label>
              <Input
                id="fecha_proximo_pago"
                type="date"
                value={fechaProximoPago}
                onChange={(e) => setFechaProximoPago(e.target.value)}
              />
            </div>
          </div>

          {/* Link y Fecha entrega */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="link_pagina">Link de la página</Label>
              <Input
                id="link_pagina"
                value={linkPagina}
                onChange={(e) => setLinkPagina(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_entrega">Fecha de entrega</Label>
              <Input
                id="fecha_entrega"
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
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
            {tecnologias.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tecnologias.map((tech) => (
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

          {/* Documentación */}
          <div className="space-y-2">
            <Label htmlFor="documentacion">Documentación</Label>
            <Textarea
              id="documentacion"
              value={documentacion}
              onChange={(e) => setDocumentacion(e.target.value)}
              placeholder="Descripción técnica o manual del proyecto..."
              rows={3}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas para el cliente</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas visibles para el cliente..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear proyecto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
