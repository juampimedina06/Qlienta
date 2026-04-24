create table proyectos (
  id uuid primary key default gen_random_uuid(),

  -- relación con el cliente
  cliente_id uuid references profiles(id) on delete cascade,

  -- datos del proyecto
  nombre_proyecto text not null,
  documentacion text,                       -- descripcion tecnica o manual
  link_pagina text,                         -- url del sitio entregado
  estado_pagina text default 'en desarrollo' check (estado_pagina in ('en desarrollo', 'en revision', 'publicado', 'pausado', 'cancelado')),

  -- datos economicos
  precio numeric(10, 2),                    -- precio total del proyecto
  pago_mensual numeric(10, 2),             -- mantenimiento mensual
  fecha_proximo_pago date,                 -- para alertas de vencimiento
  pagado boolean default false,

  -- extras
  tecnologias text[],                      -- ej: ['Next.js', 'Supabase']
  fecha_entrega date,                      -- fecha estimada o real de entrega
  notas text,                              -- notas visibles para el cliente

  -- relación con el futuro cliente original (trazabilidad)
  futuro_cliente_id uuid references futuros_clientes(id),

  -- timestamps
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