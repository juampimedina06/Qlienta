"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface UpdateClienteData {
  id: string;
  name?: string;
  phone?: string;
  country_code?: string;
}

export async function updateCliente(clienteData: UpdateClienteData) {
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
      return { success: false, error: "Solo administradores pueden editar clientes" };
    }

    const { id, ...updateFields } = clienteData;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating cliente:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/clientes");
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error in updateCliente:", error);
    return { success: false, error: "Error inesperado al actualizar el cliente" };
  }
}
