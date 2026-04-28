"use server";

import { createClient } from "@/lib/supabase/server";
import { Proyecto } from "@/interface/proyecto";

export async function getClienteProyectos(): Promise<{
  success: boolean;
  data?: Proyecto[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "No autorizado" };
    }

    const { data, error } = await supabase
      .from("proyectos")
      .select("*")
      .eq("cliente_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cliente proyectos:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Proyecto[] };
  } catch (error) {
    console.error("Unexpected error in getClienteProyectos:", error);
    return { success: false, error: "Error inesperado al cargar tus proyectos" };
  }
}
