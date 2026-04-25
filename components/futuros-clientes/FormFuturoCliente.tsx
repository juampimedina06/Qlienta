"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { createFuturoCliente } from "@/actions/futuros-clientes/create-futuro-cliente";
import { updateFuturoCliente } from "@/actions/futuros-clientes/update-futuro-cliente";
import { FuturoCliente, FuturoClienteEstado } from "@/interface/futuro-cliente";
import { useAuth } from "@/context/AuthContext";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Tipos ---

interface FuturoClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  futuroCliente: FuturoCliente | null;
  onSuccess: () => void;
}

// --- Schema ---

const futuroClienteSchema = z
  .object({
    nombre_negocio: z.string().min(1, "El nombre del negocio es requerido"),
    ubicacion_negocio: z.string().min(1, "La ubicación es requerida"),
    categoria: z.string().min(1, "La categoría es requerida"),
    informacion_negocio: z.string().optional(),
    nombre_contacto: z.string().min(1, "El nombre del contacto es requerido"),
    email_contacto: z.string().email("Email inválido"),
    telefono_contacto: z.string().optional(),
    estado: z.enum(["en creacion", "creado", "rechazado", "aceptado"] as const),
    logo_negocio: z.string().optional(),
    notas_internas: z.string().optional(),
    motivo_rechazo: z.string().optional(),
    proyecto_desplegado: z.string().optional(),
  })
  .refine(
    (data) =>
      data.estado !== "rechazado" ||
      (data.motivo_rechazo && data.motivo_rechazo.trim().length > 0),
    {
      message: "El motivo de rechazo es requerido",
      path: ["motivo_rechazo"],
    },
  );

type FuturoClienteFormValues = z.infer<typeof futuroClienteSchema>;

const CATEGORIAS = [
  "Gastronomía",
  "Retail",
  "Servicios",
  "Tecnología",
  "Salud",
  "Educación",
  "Inmobiliaria",
  "Otro",
];

// --- Componente ---

export function FuturoClienteForm({
  isOpen,
  onClose,
  futuroCliente,
  onSuccess,
}: FuturoClienteFormProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FuturoClienteFormValues>({
    resolver: zodResolver(futuroClienteSchema),
    defaultValues: {
      nombre_negocio: "",
      ubicacion_negocio: "",
      categoria: "",
      informacion_negocio: "",
      nombre_contacto: "",
      email_contacto: "",
      telefono_contacto: "",
      estado: "en creacion",
      logo_negocio: "",
      notas_internas: "",
      motivo_rechazo: "",
      proyecto_desplegado: "",
    },
  });

  const estadoValue = watch("estado");
  const categoriaValue = watch("categoria");
  const isRechazado = estadoValue === "rechazado";

  useEffect(() => {
    if (futuroCliente) {
      reset({
        nombre_negocio: futuroCliente.nombre_negocio,
        ubicacion_negocio: futuroCliente.ubicacion_negocio,
        categoria: futuroCliente.categoria,
        informacion_negocio: futuroCliente.informacion_negocio || "",
        nombre_contacto: futuroCliente.nombre_contacto,
        email_contacto: futuroCliente.email_contacto,
        telefono_contacto: futuroCliente.telefono_contacto || "",
        estado: futuroCliente.estado,
        logo_negocio: futuroCliente.logo_negocio || "",
        notas_internas: futuroCliente.notas_internas || "",
        motivo_rechazo: futuroCliente.motivo_rechazo || "",
        proyecto_desplegado: futuroCliente.proyecto_desplegado || "",
      });
    } else {
      reset({
        nombre_negocio: "",
        ubicacion_negocio: "",
        categoria: "",
        informacion_negocio: "",
        nombre_contacto: "",
        email_contacto: "",
        telefono_contacto: "",
        estado: "en creacion",
        logo_negocio: "",
        notas_internas: "",
        motivo_rechazo: "",
      });
    }
  }, [futuroCliente, reset, isOpen]);

  const onSubmit = async (data: FuturoClienteFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Datos del negocio
      formData.append("nombre_negocio", data.nombre_negocio);
      formData.append("ubicacion_negocio", data.ubicacion_negocio);
      formData.append("categoria", data.categoria);
      formData.append("informacion_negocio", data.informacion_negocio || "");

      // Contacto
      formData.append("nombre_contacto", data.nombre_contacto);
      formData.append("email_contacto", data.email_contacto);
      formData.append("telefono_contacto", data.telefono_contacto || "");

      // Estado y seguimiento
      formData.append("estado", data.estado);
      formData.append("notas_internas", data.notas_internas || "");
      if (isRechazado) {
        formData.append("motivo_rechazo", data.motivo_rechazo || "");
      }

      // Logo
      formData.append("logo_negocio", data.logo_negocio || "");

      // Proyecto desplegado (solo se enviará si tiene valor, la acción verifica el rol)
      formData.append("proyecto_desplegado", data.proyecto_desplegado || "");

      let result;
      if (futuroCliente) {
        formData.append("id", futuroCliente.id);
        result = await updateFuturoCliente(formData);
      } else {
        result = await createFuturoCliente(formData);
      }

      if (result.success) {
        toast.success(
          futuroCliente
            ? "Prospecto actualizado correctamente"
            : "Prospecto creado correctamente",
        );
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || "Ocurrió un error al guardar el prospecto");
      }
    } catch (error) {
      console.error("Error saving futuro cliente:", error);
      toast.error("Error inesperado al guardar el prospecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {futuroCliente ? "Editar Prospecto" : "Nuevo Futuro Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* ── Datos del negocio ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Datos del negocio
            </p>

            <div className="space-y-2">
              <Label htmlFor="nombre_negocio">Nombre del negocio *</Label>
              <Input
                id="nombre_negocio"
                {...register("nombre_negocio")}
                placeholder="Ej: Panadería El Trigo"
                disabled={loading}
              />
              {errors.nombre_negocio && (
                <p className="text-xs text-red-500">
                  {errors.nombre_negocio.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ubicacion_negocio">Ubicación *</Label>
                <Input
                  id="ubicacion_negocio"
                  {...register("ubicacion_negocio")}
                  placeholder="Ej: Córdoba, Argentina"
                  disabled={loading}
                />
                {errors.ubicacion_negocio && (
                  <p className="text-xs text-red-500">
                    {errors.ubicacion_negocio.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select
                  value={categoriaValue}
                  onValueChange={(val) => setValue("categoria", val)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoria && (
                  <p className="text-xs text-red-500">
                    {errors.categoria.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="informacion_negocio">
                Información general del negocio
              </Label>
              <Textarea
                id="informacion_negocio"
                {...register("informacion_negocio")}
                placeholder="Descripción breve del negocio, qué vende, su contexto..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_negocio">URL del Logo del negocio</Label>
              <Input
                id="logo_negocio"
                {...register("logo_negocio")}
                placeholder="https://ejemplo.com/logo.png"
                disabled={loading}
              />
              <p className="text-[10px] text-muted-foreground">
                Pegá la URL de una imagen externa.
              </p>
            </div>
          </section>

          {/* ── Contacto ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Datos de contacto
            </p>

            <div className="space-y-2">
              <Label htmlFor="nombre_contacto">Nombre del contacto *</Label>
              <Input
                id="nombre_contacto"
                {...register("nombre_contacto")}
                placeholder="Nombre y apellido"
                disabled={loading}
              />
              {errors.nombre_contacto && (
                <p className="text-xs text-red-500">
                  {errors.nombre_contacto.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email_contacto">Email *</Label>
                <Input
                  id="email_contacto"
                  type="email"
                  {...register("email_contacto")}
                  placeholder="correo@ejemplo.com"
                  disabled={loading}
                />
                {errors.email_contacto && (
                  <p className="text-xs text-red-500">
                    {errors.email_contacto.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono_contacto">Teléfono</Label>
                <Input
                  id="telefono_contacto"
                  type="tel"
                  {...register("telefono_contacto")}
                  placeholder="+54 9 351 000-0000"
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* ── Seguimiento ── */}
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Seguimiento
            </p>

            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={estadoValue}
                onValueChange={(val: FuturoClienteEstado) =>
                  setValue("estado", val)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en creacion">En creación</SelectItem>
                  <SelectItem value="creado">Creado</SelectItem>
                  <SelectItem value="aceptado">Aceptado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas_internas">Notas internas</Label>
              <Textarea
                id="notas_internas"
                {...register("notas_internas")}
                placeholder="Observaciones del empleado o admin..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Motivo de rechazo — condicional */}
            {isRechazado && (
              <div className="space-y-2 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <Label htmlFor="motivo_rechazo" className="text-orange-800">
                  Motivo de rechazo *
                </Label>
                <Textarea
                  id="motivo_rechazo"
                  {...register("motivo_rechazo")}
                  placeholder="Indicar por qué se rechazó este prospecto..."
                  rows={3}
                  disabled={loading}
                  className="border-orange-200 bg-white"
                />
                {errors.motivo_rechazo && (
                  <p className="text-xs text-red-500">
                    {errors.motivo_rechazo.message}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ── Admin Only: Proyecto Desplegado ── */}
          {isAdmin && (
            <section className="space-y-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Configuración Administrador
              </p>
              <div className="space-y-2">
                <Label htmlFor="proyecto_desplegado">Link del Proyecto Desplegado</Label>
                <Input
                  id="proyecto_desplegado"
                  {...register("proyecto_desplegado")}
                  placeholder="https://proyecto-cliente.vercel.app"
                  disabled={loading}
                  className="border-primary/20 bg-white"
                />
                <p className="text-[10px] text-muted-foreground">
                  Solo visible para empleados cuando el link esté cargado.
                </p>
              </div>
            </section>
          )}

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
                {futuroCliente ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
