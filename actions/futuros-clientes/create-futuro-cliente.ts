"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createFuturoCliente(formData: FormData) {
  try {
    const supabase = await createClient();

    // Obtener el usuario actual para 'creado_por'
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const nombre_negocio = formData.get("nombre_negocio") as string;
    const ubicacion_negocio = formData.get("ubicacion_negocio") as string;
    const categoria = formData.get("categoria") as string;
    const informacion_negocio = formData.get("informacion_negocio") as string;
    const nombre_contacto = formData.get("nombre_contacto") as string;
    const email_contacto = formData.get("email_contacto") as string;
    const telefono_contacto = formData.get("telefono_contacto") as string;
    const estado = formData.get("estado") as string;
    const notas_internas = formData.get("notas_internas") as string;
    const logo_negocio = formData.get("logo_negocio") as string;

    const { data, error } = await supabase
      .from("futuros_clientes")
      .insert([
        {
          nombre_negocio,
          ubicacion_negocio,
          categoria,
          informacion_negocio,
          nombre_contacto,
          email_contacto,
          telefono_contacto,
          estado,
          notas_internas,
          logo_negocio: logo_negocio || null,
          creado_por: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating futuro cliente:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/empleado");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in createFuturoCliente:", error);
    return { success: false, error: "Error inesperado al crear el prospecto" };
  }
}
