"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFuturosClientesStats() {
  try {
    const supabase = await createClient();

    // Fetch counts for each status group
    const { data, error } = await supabase
      .from("futuros_clientes")
      .select("estado");

    if (error) {
      console.error("Error fetching stats:", error);
      return { success: false, error: error.message };
    }

    const stats = {
      nuevos: data.filter(d => d.estado === "creado" || d.estado === "en creacion").length,
      aceptados: data.filter(d => d.estado === "aceptado").length,
      rechazados: data.filter(d => d.estado === "rechazado").length,
    };

    return { success: true, stats };
  } catch (error) {
    console.error("Unexpected error in getFuturosClientesStats:", error);
    return { success: false, error: "Error inesperado al cargar estadísticas" };
  }
}
