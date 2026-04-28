"use server";

import { createClient } from "@/lib/supabase/server";
import { User } from "@/interface/user";

export async function getClienteById(id: string): Promise<{
  success: boolean;
  data?: User;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .eq("role", "cliente")
      .single();

    if (error) {
      console.error("Error fetching cliente:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as User };
  } catch (error) {
    console.error("Unexpected error in getClienteById:", error);
    return { success: false, error: "Error inesperado al cargar cliente" };
  }
}
