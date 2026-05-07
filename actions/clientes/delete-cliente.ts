"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteCliente(id: string) {
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
      return { success: false, error: "Solo administradores pueden eliminar clientes" };
    }

    // Usar el cliente admin para borrar el usuario de Auth
    const adminClient = createAdminClient();
    const { error } = await adminClient.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting cliente:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/clientes");
    return { success: true };
  } catch (error: any) {
    console.error("Unexpected error in deleteCliente:", error);
    return { 
      success: false, 
      error: error.message === "Supabase Admin environment variables are missing" 
        ? "Configuración faltante: SUPABASE_SERVICE_ROLE_KEY"
        : "Error inesperado al eliminar el cliente" 
    };
  }
}

