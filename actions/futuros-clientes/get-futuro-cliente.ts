"use server";

import { createClient } from "@/lib/supabase/server";
import { FuturoCliente } from "@/interface/futuro-cliente";

interface GetFuturosClientesParams {
  page: number;
  limit: number;
  search?: string;
  estado?: string;
  categoria?: string;
}

export async function getFuturosClientes({
  page,
  limit,
  search,
  estado,
  categoria,
}: GetFuturosClientesParams) {
  try {
    const supabase = await createClient();

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("futuros_clientes")
      .select("*", { count: "exact" });

    // Filtros
    if (search) {
      query = query.or(
        `nombre_negocio.ilike.%${search}%,nombre_contacto.ilike.%${search}%,email_contacto.ilike.%${search}%`,
      );
    }

    if (estado && estado !== "all") {
      query = query.eq("estado", estado);
    }

    if (categoria && categoria !== "all") {
      query = query.eq("categoria", categoria);
    }

    // Paginación y orden
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching futuros clientes:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as FuturoCliente[],
      count: count || 0,
      hasMore: count ? from + limit < count : false,
    };
  } catch (error) {
    console.error("Unexpected error in getFuturosClientes:", error);
    return { success: false, error: "Error inesperado al cargar prospectos" };
  }
}
