'use server'


import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

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

  const adminClient = createAdminClient()
  const { error, data } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    email_confirm: true,
    user_metadata: {
      name: formData.name,
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