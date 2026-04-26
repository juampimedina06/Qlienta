"use server";

import { createClient } from "@/lib/supabase/server";
import { FuturoCliente } from "@/interface/futuro-cliente";

export async function getFuturoClienteById(id: string): Promise<{
  success: boolean;
  data?: FuturoCliente;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("futuros_clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching futuro cliente:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as FuturoCliente };
  } catch (error) {
    console.error("Unexpected error in getFuturoClienteById:", error);
    return { success: false, error: "Error inesperado al cargar prospecto" };
  }
}