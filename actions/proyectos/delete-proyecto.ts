"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteProyecto(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("proyectos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting proyecto:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/proyectos");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error in deleteProyecto:", error);
    return { success: false, error: "Error inesperado al eliminar el proyecto" };
  }
}
