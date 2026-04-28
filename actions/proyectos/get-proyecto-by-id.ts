"use server";

import { createClient } from "@/lib/supabase/server";
import { Proyecto } from "@/interface/proyecto";

export async function getProyectoById(id: string): Promise<{
  success: boolean;
  data?: Proyecto;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("proyectos")
      .select("*, cliente:profiles!cliente_id(id, full_name:name, email, avatar_url)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching proyecto:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Proyecto };
  } catch (error) {
    console.error("Unexpected error in getProyectoById:", error);
    return { success: false, error: "Error inesperado al cargar proyecto" };
  }
}
