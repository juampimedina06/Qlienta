"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
    const adminClient = createAdminClient();

    // 1. Actualizar el perfil en la tabla 'profiles' (usamos admin para saltar RLS)
    const { data, error } = await adminClient
      .from("profiles")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    // 2. Si se cambió el nombre, sincronizar con la metadata de Auth
    if (updateFields.name) {
      const { error: authError } = await adminClient.auth.admin.updateUserById(id, {
        user_metadata: { name: updateFields.name },
      });

      if (authError) {
        console.error("Error updating auth metadata:", authError);
        // No fallamos toda la operación si esto falla, pero lo logueamos
      }
    }

    revalidatePath("/admin/clientes");
    return { success: true, data };
  } catch (error: any) {
    console.error("Unexpected error in updateCliente:", error);
    return { 
      success: false, 
      error: error.message === "Supabase Admin environment variables are missing" 
        ? "Configuración faltante: SUPABASE_SERVICE_ROLE_KEY"
        : "Error inesperado al editar el cliente" 
    };
  }
}
