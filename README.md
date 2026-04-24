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

## Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### Base de Datos

Ejecutar los scripts SQL en Supabase SQL Editor:

1. `sb-perfil.sql` - Tabla de perfiles y triggers de autenticación
2. `sb-ejTabla.sql` - Tabla de tareas y storage

### Instalación

```bash
npm install
npm run dev
```

El servidor desarrollo corre en `http://localhost:3000`.

## Scripts Disponibles

| Comando         | Descripción                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Iniciar servidor de desarrollo |
| `npm run build` | Build de producción            |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint`  | Ejecutar ESLint                |

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
