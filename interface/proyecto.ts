export type EstadoPagina =
  | "en desarrollo"
  | "en revision"
  | "publicado"
  | "pausado"
  | "cancelado";

export interface Proyecto {
  id: string;
  cliente_id: string;
  nombre_proyecto: string;
  documentacion: string | null;
  link_pagina: string | null;
  estado_pagina: EstadoPagina;
  precio: number | null;
  pago_mensual: number | null;
  fecha_proximo_pago: string | null;
  pagado: boolean;
  tecnologias: string[] | null;
  fecha_entrega: string | null;
  notas: string | null;
  futuro_cliente_id: string | null;
  created_at: string;
  updated_at: string;
  // join opcional con profiles
  cliente?: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}