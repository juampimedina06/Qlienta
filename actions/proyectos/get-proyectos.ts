"use server";

import { createClient } from "@/lib/supabase/server";
import { Proyecto } from "@/interface/proyecto";

interface GetProyectosParams {
  page: number;
  limit: number;
  search?: string;
  estado?: string;
  pagado?: string;
}

export async function getProyectos({
  page,
  limit,
  search,
  estado,
  pagado,
}: GetProyectosParams) {
  try {
    const supabase = await createClient();

    const from = page * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("proyectos")
      .select("*, cliente:profiles!cliente_id(id, full_name:name, email, avatar_url)", {
        count: "exact",
      });

    // Filtros
    if (search) {
      query = query.or(
        `nombre_proyecto.ilike.%${search}%`,
      );
    }

    if (estado && estado !== "all") {
      query = query.eq("estado_pagina", estado);
    }

    if (pagado && pagado !== "all") {
      query = query.eq("pagado", pagado === "true");
    }

    // Paginación y orden
    const { data, count, error } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching proyectos:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as Proyecto[],
      count: count || 0,
      hasMore: count ? from + limit < count : false,
    };
  } catch (error) {
    console.error("Unexpected error in getProyectos:", error);
    return { success: false, error: "Error inesperado al cargar proyectos" };
  }
}
