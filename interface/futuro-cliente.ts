export type FuturoClienteEstado = "en creacion" | "creado" | "rechazado" | "aceptado";

export interface FuturoCliente {
  id: string;
  nombre_negocio: string;
  ubicacion_negocio: string;
  logo_negocio: string | null;
  categoria: string;
  informacion_negocio: string | null;
  nombre_contacto: string;
  email_contacto: string;
  telefono_contacto: string | null;
  estado: FuturoClienteEstado;
  notas_internas: string | null;
  motivo_rechazo: string | null;
  creado_por: string | null;
  proyecto_desplegado: string | null;
  created_at: string;
  updated_at: string;
}