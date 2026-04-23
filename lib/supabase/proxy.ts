import { getUser } from '@/actions/auth/get-user'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  const  user  = await getUser()

  console.log("user", user);

  const pathname = request.nextUrl.pathname

  // Rutas protegidas por rol
  const adminRoutes = ['/admin']
  const empleadoRoutes = ['/empleado']
  const clienteRoutes = ['/cliente']

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))
  const isEmpleadoRoute = empleadoRoutes.some((r) => pathname.startsWith(r))
  const isClienteRoute = clienteRoutes.some((r) => pathname.startsWith(r))
  const isProtected = isAdminRoute || isEmpleadoRoute || isClienteRoute

  // No autenticado → redirigir al login
  if (!user && isProtected) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const role = user?.role

  // Ruta no corresponde al rol → redirigir al login
  if (isAdminRoute && role !== 'admin')
    return NextResponse.redirect(new URL('/login', request.url))

    if (isEmpleadoRoute && role !== 'empleado')
      return NextResponse.redirect(new URL('/login', request.url))

    if (isClienteRoute && role !== 'cliente')
      return NextResponse.redirect(new URL('/login', request.url))

    // Autenticado → evitar volver al login
    if (user && pathname === '/') {
      if (role === 'admin') return NextResponse.redirect(new URL('/admin', request.url))
      if (role === 'empleado') return NextResponse.redirect(new URL('/empleado', request.url))
      if (role === 'cliente') return NextResponse.redirect(new URL('/cliente', request.url))
    }
  

  return supabaseResponse
}