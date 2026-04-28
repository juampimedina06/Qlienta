"use server";

import { createClient } from "@/lib/supabase/server";
import { User } from "@/interface/user";

interface GetClientesParams {
  page: number;
  limit: number;
  search?: string;
}

export async function getClientes({
  page,
  limit,
  search,
}: GetClientesParams) {
  try {
    const supabase = await createClient();

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .eq("role", "cliente");

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }

    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching clientes:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as User[],
      count: count || 0,
      hasMore: count ? from + limit < count : false,
    };
  } catch (error) {
    console.error("Unexpected error in getClientes:", error);
    return { success: false, error: "Error inesperado al cargar clientes" };
  }
}
