"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface DarAltaClienteData {
  proyecto_id: string;
  nombre: string;
  email: string;
  password: string;
}

export async function darAltaCliente(data: DarAltaClienteData) {
  try {
    const supabase = await createClient();

    // Verificar que el usuario es admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "No autorizado" };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return { success: false, error: "Solo administradores pueden dar de alta clientes" };
    }

    // Verificar que el proyecto existe y está en estado aceptado-compatible
    const { data: proyecto, error: proyectoError } = await supabase
      .from("proyectos")
      .select("id, estado_pagina, cliente_id")
      .eq("id", data.proyecto_id)
      .single();

    if (proyectoError || !proyecto) {
      return { success: false, error: "Proyecto no encontrado" };
    }

    if (proyecto.cliente_id) {
      return { success: false, error: "Este proyecto ya tiene un cliente asignado" };
    }

    // Crear el usuario en Supabase Auth
    const { error: signUpError, data: signUpData } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        name: data.nombre,
      },
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    const newUserId = signUpData.user.id;

    // Asignar rol de cliente al profile
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: "cliente" })
      .eq("id", newUserId);

    if (roleError) {
      console.error("Error updating role:", roleError);
    }

    // Vincular el proyecto al nuevo cliente
    const { error: linkError } = await supabase
      .from("proyectos")
      .update({ cliente_id: newUserId })
      .eq("id", data.proyecto_id);

    if (linkError) {
      return { success: false, error: "Usuario creado pero error al vincular proyecto: " + linkError.message };
    }

    revalidatePath("/admin/proyectos");
    revalidatePath(`/admin/proyectos/${data.proyecto_id}`);

    return {
      success: true,
      message: "Cliente dado de alta y vinculado al proyecto exitosamente",
      userId: newUserId,
    };
  } catch (error) {
    console.error("Unexpected error in darAltaCliente:", error);
    return { success: false, error: "Error inesperado al dar de alta al cliente" };
  }
}
