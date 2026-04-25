create table futuros_clientes (
  id uuid primary key default gen_random_uuid(),

  -- datos del negocio
  nombre_negocio text not null,
  ubicacion_negocio text not null,
  logo_negocio text,                        -- url del archivo en supabase storage
  categoria text not null,                  -- ej: gastronomia, retail, servicios
  informacion_negocio text,                 -- descripcion general

  -- contacto
  nombre_contacto text not null,
  email_contacto text not null,
  telefono_contacto text,

  -- estado y seguimiento
  estado text default 'en creacion' check (estado in ('en creacion', 'creado', 'rechazado', 'aceptado')),
  notas_internas text,                      -- comentarios del empleado o admin
  motivo_rechazo text,                      -- se completa si estado = 'rechazado'

  -- relaciones
  creado_por uuid references profiles(id),  -- empleado que lo cargó

  -- timestamps
  proyecto_desplegado text,                 -- link del proyecto una vez desplegado
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);


-- =====================
-- RLS
-- =====================
alter table futuros_clientes enable row level security;
alter table proyectos enable row level security;

-- empleado ve y edita solo los suyos
create policy "empleado gestiona los suyos"
on futuros_clientes for all
using (creado_por = auth.uid());

-- admin ve todo en futuros_clientes
create policy "admin gestiona futuros_clientes"
on futuros_clientes for all
using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- cliente ve solo su proyecto
create policy "cliente ve su proyecto"
on proyectos for select
using (cliente_id = auth.uid());

-- admin ve y edita todos los proyectos
create policy "admin gestiona proyectos"
on proyectos for all
using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- =====================
-- TRIGGER updated_at automático
-- =====================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_futuros
before update on futuros_clientes
for each row execute procedure update_updated_at();

create trigger set_updated_at_proyectos
before update on proyectos
for each row execute procedure update_updated_at();