"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/actions/auth/get-user";

export async function updateFuturoCliente(formData: FormData) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    const id = formData.get("id") as string;
    const nombre_negocio = formData.get("nombre_negocio") as string;
    const ubicacion_negocio = formData.get("ubicacion_negocio") as string;
    const categoria = formData.get("categoria") as string;
    const informacion_negocio = formData.get("informacion_negocio") as string;
    const nombre_contacto = formData.get("nombre_contacto") as string;
    const email_contacto = formData.get("email_contacto") as string;
    const telefono_contacto = formData.get("telefono_contacto") as string;
    const estado = formData.get("estado") as string;
    const notas_internas = formData.get("notas_internas") as string;
    const motivo_rechazo = formData.get("motivo_rechazo") as string;
    const logo_negocio = formData.get("logo_negocio") as string;
    const proyecto_desplegado = formData.get("proyecto_desplegado") as string;

    const updateData: any = {
      nombre_negocio,
      ubicacion_negocio,
      categoria,
      informacion_negocio,
      nombre_contacto,
      email_contacto,
      telefono_contacto,
      estado,
      notas_internas,
      motivo_rechazo: estado === "rechazado" ? motivo_rechazo : null,
      logo_negocio: logo_negocio || null,
    };

    // Solo el admin puede actualizar el proyecto desplegado
    if (user?.role === "admin" && proyecto_desplegado !== null) {
      updateData.proyecto_desplegado = proyecto_desplegado || null;
    }

    const { data, error } = await supabase
      .from("futuros_clientes")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating futuro cliente:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/empleado");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in updateFuturoCliente:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar el prospecto",
    };
  }
}
