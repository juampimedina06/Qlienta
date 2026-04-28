"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface DarAltaFuturoClienteData {
  futuro_cliente_id: string;
  password: string;
  nombre_proyecto?: string;
}

export async function darAltaFuturoCliente(data: DarAltaFuturoClienteData) {
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

    // Obtener datos del futuro cliente
    const { data: futuroCliente, error: fcError } = await supabase
      .from("futuros_clientes")
      .select("*")
      .eq("id", data.futuro_cliente_id)
      .single();

    if (fcError || !futuroCliente) {
      return { success: false, error: "Futuro cliente no encontrado" };
    }

    if (futuroCliente.estado !== "aceptado") {
      return { success: false, error: "El futuro cliente debe estar en estado 'aceptado'" };
    }

    // Crear el usuario en Supabase Auth
    const { error: signUpError, data: signUpData } = await supabase.auth.admin.createUser({
      email: futuroCliente.email_contacto,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        name: futuroCliente.nombre_contacto,
      },
    });

    if (signUpError) {
      return { success: false, error: signUpError.message };
    }

    const newUserId = signUpData.user.id;

    // Asignar rol de cliente
    const { error: roleError } = await supabase
      .from("profiles")
      .update({ role: "cliente" })
      .eq("id", newUserId);

    if (roleError) {
      console.error("Error updating role:", roleError);
    }

    // Crear el proyecto vinculado
    const nombreProyecto = data.nombre_proyecto || `Proyecto ${futuroCliente.nombre_negocio}`;
    
    const { error: proyectoError } = await supabase
      .from("proyectos")
      .insert([{
        nombre_proyecto: nombreProyecto,
        cliente_id: newUserId,
        futuro_cliente_id: data.futuro_cliente_id,
        estado_pagina: "en desarrollo",
        link_pagina: futuroCliente.proyecto_desplegado || null,
        notas: futuroCliente.informacion_negocio || null,
      }]);

    if (proyectoError) {
      return {
        success: false,
        error: "Usuario creado pero error al crear proyecto: " + proyectoError.message,
      };
    }

    revalidatePath("/admin/futurosClientes");
    revalidatePath("/admin/clientes");
    revalidatePath("/admin/proyectos");

    return {
      success: true,
      message: `Cliente "${futuroCliente.nombre_contacto}" dado de alta con proyecto vinculado exitosamente`,
      userId: newUserId,
    };
  } catch (error) {
    console.error("Unexpected error in darAltaFuturoCliente:", error);
    return { success: false, error: "Error inesperado al dar de alta al cliente" };
  }
}
