'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function login(formData:{email: string, password: string}) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.signInWithPassword(formData)

  if (error) {
    return { 
        success: false, 
        error: error.message
     }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    console.error('Error al obtener el perfil:', profileError);
    return {
      success: true,
      message: "Usuario autenticado, pero hubo un problema al obtener el perfil",
      data
    }
  }

  revalidatePath('/', 'layout')
  return { 
    success: true,
    message: "Usuario autenticado exitosamente",
    data: {
      ...data,
      role: profile.role
    }
   }
}


export async function sendRecoveryEmail(formData: {email: string}) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.resetPasswordForEmail(formData.email)

  if (error) {
    return {
        success: false, 
        error: error.message
     }
  }

  return { 
    success: true,
    message: "Se ha enviado un correo de recuperación. Por favor, revisa tu bandeja de entrada.",
    data
   }
}

export async function updatePassword(formData: {password: string}) {
  const supabase = await createClient()

  const { error, data } = await supabase.auth.updateUser({
    password: formData.password
  })

  if (error) {
    return { 
        success: false, 
        error: error.message
     }
  }

  return { 
    success: true,
    message: "Contraseña actualizada exitosamente",
    data
   }
}