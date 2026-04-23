# Gestión de Clientes

Sistema web para la gestión integral de clientes desarrollado con Next.js 16 y Supabase.

## Descripción

Plataforma empresarial para administrar clientes con autenticación segura basada en roles (Administrador/Empleado/cliente), registro de clientes, perfiles de usuario y gestión de futuros clientes.

## Tecnologías

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS 4, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **Validación**: Zod, React Hook Form
- **UI**: Radix UI, Lucide Icons

## Estructura del Proyecto

```
gestion-clientes/
├── actions/              # Server Actions de Next.js
│   ├── admin/          # Acciones del panel de administración
│   └── auth/          # Acciones de autenticación
├── app/               # App Router de Next.js
│   ├── admin/         # Panel de administración
│   ├── empleado/     # Panel de empleado
│   └── *.page.tsx    # Páginas públicas
├── components/       # Componentes React
│   ├── auth/          # Componentes de autenticación
│   └── ui/            # Componentes UI (shadcn)
├── context/           # Contextos de React
├── lib/               # Utilidades y clientes
│   └── supabase/      # Clientes de Supabase
├── interface/         # TypeScript interfaces
└── sb-*.sql          # Scripts de base de datos
```

## Roles de Usuario

| Rol           | Descripción                                |
| ------------- | ------------------------------------------ |
| Administrador | Acceso completo, puede registrar clientes  |
| Empleado      | Acceso limitado, gestión de tareas propias |
| Cliente       | visualizacion de su proyecto a detalle     |

## Características

- Autenticación con email/password (Supabase Auth)
- Recuperación de contraseña
- Perfiles de usuario con avatar
- Panel administrativo con registro de clientes
- Listado de empleados
- Gestión de tareas por empleado
- Upload de imágenes (avatares, tareas)
- UI responsive con componentes accesibles

## Licencia

MIT
