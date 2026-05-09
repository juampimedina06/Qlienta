# Qlienta - Plataforma de Gestión Integral

Un sistema web avanzado para la gestión integral de clientes, proyectos y leads (futuros clientes), desarrollado con **Next.js 16** y **Supabase**.

## 🚀 Descripción

Qlienta es una plataforma empresarial diseñada para administrar la relación con los clientes (CRM), gestionar proyectos internos y coordinar el trabajo de los empleados. Cuenta con autenticación segura, control de accesos basado en roles (Administrador, Empleado, Cliente), registro de clientes potenciales (leads), perfiles de usuario y gestión visual de proyectos. Todo esto con una interfaz premium, moderna y responsiva.

## 🛠 Tecnologías Principales

- **Framework**: Next.js 16 (App Router)
- **Librería de UI**: React 19, TypeScript
- **Estilos**: Tailwind CSS 4, shadcn/ui, Radix UI
- **Backend & Base de Datos**: Supabase (PostgreSQL, Auth, Storage)
- **Formularios & Validación**: React Hook Form, Zod
- **Iconografía**: Lucide React
- **Multimedia**: Cloudinary (para optimización de videos de fondo)

## 📂 Estructura del Proyecto

```text
gestion-clientes/
├── actions/              # Server Actions de Next.js (lógica de servidor)
│   ├── admin/            # Acciones del panel de administración
│   ├── auth/             # Acciones de autenticación
│   ├── clientes/         # Acciones de manejo de clientes
│   ├── futuros-clientes/ # Acciones de CRM y leads
│   └── proyectos/        # Acciones de gestión de proyectos
├── app/                  # Rutas y vistas (App Router)
│   ├── (auth)/           # Rutas de login y autenticación
│   ├── admin/            # Dashboard de administración
│   ├── cliente/          # Dashboard para clientes
│   ├── empleado/         # Dashboard para empleados
│   ├── api/              # Endpoints de API internos
│   └── update-password/  # Flujo de recuperación de clave
├── components/           # Componentes React reutilizables
│   ├── auth/             # Componentes específicos de Auth
│   └── ui/               # Componentes atómicos de shadcn
├── context/              # Context API (manejo de estado global, AuthContext)
├── interface/            # Interfaces y tipos de TypeScript
├── lib/                  # Utilidades compartidas
│   └── supabase/         # Configuración y clientes de Supabase (SSR/Browser)
└── *.sql                 # Scripts de inicialización de la Base de Datos
```

## 👥 Roles de Usuario

El sistema cuenta con un modelo de seguridad basado en roles, controlando tanto la navegación en el frontend como los accesos a datos mediante políticas RLS (Row Level Security) en Supabase:

| Rol | Nivel de Acceso | Funciones Principales |
| :--- | :--- | :--- |
| **Administrador** | Acceso Total | Gestión de empleados, alta de clientes, control de futuros clientes (leads), gestión de proyectos globales. |
| **Empleado** | Acceso Medio | Visualización de sus tareas asignadas, gestión de proyectos en los que participa, actualización de estados. |
| **Cliente** | Acceso Restringido | Visualización exclusiva de sus propios proyectos, avances, reportes y contacto. |

## ⚙️ Configuración y Despliegue

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto copiando las variables necesarias para conectarse a Supabase y Cloudinary (si corresponde):

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### 2. Base de Datos (Supabase)

Debes ejecutar los scripts SQL en el SQL Editor de tu proyecto en Supabase para crear las tablas, relaciones y triggers de autenticación:

1. `sb-perfil.sql` - Crea la tabla de `perfiles` en public atada a `auth.users` y configura triggers para la sincronización automática tras el registro.
2. `sb-futuros-clientes.sql` - Estructura para almacenar leads y prospectos.
3. `sq-proyectos.sql` - Creación de entidades para gestionar los proyectos, tareas y relaciones.

Asegúrate de tener habilitado **Supabase Auth** (proveedor de Email) en la configuración del proyecto.

### 3. Instalación Local

Clona el repositorio e instala las dependencias:

```bash
npm install
```

### 4. Ejecución del Entorno de Desarrollo

```bash
npm run dev
```

La aplicación estará corriendo en [http://localhost:3000](http://localhost:3000).

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo con Hot Reload.
- `npm run build`: Genera la versión de producción optimizada.
- `npm run start`: Inicia el servidor usando los archivos de producción generados.
- `npm run lint`: Ejecuta ESLint para analizar el código y encontrar problemas.

## 💎 Características Destacadas

- **Autenticación Robusta**: Login seguro, gestión de sesiones con SSR en Supabase, y recuperación de contraseñas.
- **Diseño Premium**: Interfaz moderna, con efectos de glassmorphism, videos de fondo integrados y transiciones fluidas.
- **CRM Integrado**: Módulo especial para captar y dar seguimiento a "Futuros Clientes" (leads).
- **Gestión de Proyectos**: Seguimiento de estado de proyectos, asignación a empleados, y visibilidad controlada para los clientes.
- **Optimización de Medios**: Migración de archivos locales pesados a Cloudinary, mejorando notablemente el performance y los tiempos de carga iniciales.
- **Full Type-Safety**: Extensivo uso de TypeScript junto a interfaces y validadores (Zod) garantizando consistencia desde el backend al frontend.

---
*Desarrollado con pasión, enfoque en arquitectura limpia y estética premium.*
