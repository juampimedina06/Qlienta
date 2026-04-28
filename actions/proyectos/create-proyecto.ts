"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CreateProyectoData {
  nombre_proyecto: string;
  cliente_id?: string | null;
  documentacion?: string | null;
  link_pagina?: string | null;
  estado_pagina?: string;
  precio?: number | null;
  pago_mensual?: number | null;
  fecha_proximo_pago?: string | null;
  pagado?: boolean;
  tecnologias?: string[] | null;
  fecha_entrega?: string | null;
  notas?: string | null;
  futuro_cliente_id?: string | null;
}

export async function createProyecto(projectData: CreateProyectoData) {
  try {
    const supabase = await createClient();

    // Verificar que el usuario es admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "Solo administradores pueden crear proyectos" };
    }

    const { data, error } = await supabase
      .from("proyectos")
      .insert([
        {
          nombre_proyecto: projectData.nombre_proyecto,
          cliente_id: projectData.cliente_id || null,
          documentacion: projectData.documentacion || null,
          link_pagina: projectData.link_pagina || null,
          estado_pagina: projectData.estado_pagina || "en desarrollo",
          precio: projectData.precio || null,
          pago_mensual: projectData.pago_mensual || null,
          fecha_proximo_pago: projectData.fecha_proximo_pago || null,
          pagado: projectData.pagado ?? false,
          tecnologias: projectData.tecnologias || null,
          fecha_entrega: projectData.fecha_entrega || null,
          notas: projectData.notas || null,
          futuro_cliente_id: projectData.futuro_cliente_id || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating proyecto:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/proyectos");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in createProyecto:", error);
    return { success: false, error: "Error inesperado al crear el proyecto" };
  }
}
