"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateProyectoData {
  id: string;
  nombre_proyecto?: string;
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

export async function updateProyecto(projectData: UpdateProyectoData) {
  try {
    const supabase = await createClient();

    const { id, ...updateFields } = projectData;

    const { data, error } = await supabase
      .from("proyectos")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating proyecto:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/proyectos");
    revalidatePath(`/admin/proyectos/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in updateProyecto:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar el proyecto",
    };
  }
}
