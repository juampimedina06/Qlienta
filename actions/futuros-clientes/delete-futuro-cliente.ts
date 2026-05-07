"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteFuturoCliente(id: string) {
  try {
    const supabase = await createClient();

    // 1. Desvincular referencias en proyectos para evitar error de FK
    await supabase
      .from("proyectos")
      .update({ futuro_cliente_id: null })
      .eq("futuro_cliente_id", id);

    // 2. Eliminar el prospecto
    const { error } = await supabase
      .from("futuros_clientes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting futuro cliente:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/futurosClientes");
    revalidatePath("/empleado");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in deleteFuturoCliente:", error);
    return { success: false, error: "Error inesperado al eliminar el prospecto" };
  }
}
