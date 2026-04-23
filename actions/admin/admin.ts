'use server'


import { createClient } from "@/lib/supabase/server"

//el admin puede hacerlo y tiene q ser de los clientes, sacar esto 
export async function signup(formData: {name: string, email: string, password: string}) {
  const supabase = await createClient()

  // verificar que quien llama es admin
  const { data: { session } } = await supabase.auth.getSession()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('No autorizado')
  }

  const { error, data } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
        data: {
            name: formData.name,
        }
    }
  })

  if (error) {
    return { 
        success: false, 
        error: error.message
     }
  }

  return { 
    success: true,
    message: "Usuario creado exitosamente",
    data
   }
}