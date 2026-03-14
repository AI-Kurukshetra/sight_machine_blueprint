create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'operator' check (role in ('admin', 'plant_manager', 'operator')),
  created_at timestamptz not null default now()
);

create table if not exists public.facilities (
  id text primary key,
  name text not null,
  location text not null,
  active_shift text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.production_lines (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  name text not null,
  status text not null check (status in ('running', 'attention', 'maintenance')),
  oee numeric(5,2) not null,
  throughput integer not null,
  target_throughput integer not null,
  yield_rate numeric(5,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id text primary key,
  line_id text not null references public.production_lines (id) on delete cascade,
  name text not null,
  type text not null,
  status text not null check (status in ('running', 'warning', 'maintenance')),
  health_score integer not null,
  utilization integer not null,
  energy_kw numeric(8,2) not null,
  last_service timestamptz not null,
  digital_twin_state text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.alerts (
  id text primary key,
  equipment_id text not null references public.equipment (id) on delete cascade,
  title text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
  category text not null,
  status text not null check (status in ('open', 'investigating', 'resolved')),
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenance_predictions (
  id text primary key,
  equipment_id text not null references public.equipment (id) on delete cascade,
  issue text not null,
  confidence integer not null,
  days_until_service integer not null,
  recommended_action text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.quality_events (
  id text primary key,
  line_id text not null references public.production_lines (id) on delete cascade,
  batch_code text not null,
  defect_category text not null,
  defect_rate numeric(5,2) not null,
  first_pass_yield numeric(5,2) not null,
  status text not null check (status in ('stable', 'watch', 'intervention')),
  checked_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.connector_statuses (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  name text not null,
  protocol text not null,
  status text not null check (status in ('healthy', 'degraded', 'offline')),
  latency_ms integer not null default 0,
  records_per_min integer not null default 0,
  last_ingested_at timestamptz not null,
  notes text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_kpis (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  name text not null,
  formula text not null,
  target_value numeric(10,2) not null,
  current_value numeric(10,2) not null,
  unit text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.anomaly_events (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  equipment_id text not null,
  signal text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low')),
  anomaly_score integer not null,
  status text not null check (status in ('new', 'reviewing', 'resolved')),
  summary text not null,
  detected_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.historical_points (
  id text primary key,
  line_id text not null references public.production_lines (id) on delete cascade,
  metric text not null check (metric in ('oee', 'throughput', 'yield', 'defect_rate')),
  value numeric(12,2) not null,
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.production_plans (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  work_order text not null,
  product text not null,
  assigned_line text not null references public.production_lines (id) on delete cascade,
  target_units integer not null,
  planned_start timestamptz not null,
  planned_end timestamptz not null,
  status text not null check (status in ('scheduled', 'in_progress', 'delayed', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.energy_records (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  line_id text not null references public.production_lines (id) on delete cascade,
  kwh numeric(12,2) not null,
  intensity_kwh_per_unit numeric(10,2) not null,
  peak_kw numeric(10,2) not null,
  recorded_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id text primary key,
  sku text not null unique,
  name text not null,
  category text not null check (category in ('raw_material', 'wip', 'finished_good')),
  on_hand integer not null default 0,
  wip integer not null default 0,
  finished_goods integer not null default 0,
  reorder_point integer not null default 0,
  status text not null check (status in ('healthy', 'watch', 'critical')),
  created_at timestamptz not null default now()
);

create table if not exists public.operator_metrics (
  id text primary key,
  operator_name text not null,
  shift text not null,
  efficiency numeric(6,2) not null,
  safety_incidents integer not null default 0,
  training_gap text not null check (training_gap in ('low', 'medium', 'high')),
  status text not null check (status in ('strong', 'watch', 'needs_support')),
  created_at timestamptz not null default now()
);

create table if not exists public.optimization_recommendations (
  id text primary key,
  line_id text not null references public.production_lines (id) on delete cascade,
  parameter text not null,
  current_value numeric(12,2) not null,
  recommended_value numeric(12,2) not null,
  expected_gain_percent numeric(8,2) not null,
  confidence integer not null,
  status text not null check (status in ('ready', 'testing', 'applied')),
  created_at timestamptz not null default now()
);

create table if not exists public.root_cause_cases (
  id text primary key,
  alert_id text not null references public.alerts (id) on delete cascade,
  issue text not null,
  probable_cause text not null,
  confidence integer not null,
  recommended_action text not null,
  status text not null check (status in ('open', 'validated', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.shift_handover_reports (
  id text primary key,
  facility_id text not null references public.facilities (id) on delete cascade,
  shift_name text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  summary text not null,
  oee numeric(8,2) not null,
  throughput integer not null,
  incidents integer not null default 0,
  handover_note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.compliance_entries (
  id text primary key,
  standard text not null,
  area text not null,
  owner text not null,
  due_date date not null,
  status text not null check (status in ('compliant', 'at_risk', 'non_compliant')),
  evidence_link text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.genealogy_records (
  id text primary key,
  batch_code text not null,
  product text not null,
  parent_batch text not null,
  equipment_path text not null,
  quality_status text not null check (quality_status in ('pass', 'hold', 'fail')),
  started_at timestamptz not null,
  completed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.spc_samples (
  id text primary key,
  line_id text not null references public.production_lines (id) on delete cascade,
  parameter text not null,
  sample_value numeric(12,4) not null,
  mean numeric(12,4) not null,
  lcl numeric(12,4) not null,
  ucl numeric(12,4) not null,
  status text not null check (status in ('in_control', 'warning', 'out_of_control')),
  sampled_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.advanced_feature_modules (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null,
  priority text not null check (priority in ('innovative', 'important')),
  complexity text not null check (complexity in ('high', 'medium', 'low')),
  adoption_percent numeric(5,2) not null,
  latency_ms integer not null,
  roi_percent numeric(8,2) not null,
  status text not null check (status in ('planned', 'pilot', 'active')),
  recommendation text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.innovation_ideas (
  id text primary key,
  title text not null,
  summary text not null,
  impact_score integer not null,
  horizon text not null check (horizon in ('near_term', 'mid_term', 'long_term')),
  readiness text not null check (readiness in ('concept', 'prototype', 'validated')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.facilities enable row level security;
alter table public.production_lines enable row level security;
alter table public.equipment enable row level security;
alter table public.alerts enable row level security;
alter table public.maintenance_predictions enable row level security;
alter table public.quality_events enable row level security;
alter table public.connector_statuses enable row level security;
alter table public.custom_kpis enable row level security;
alter table public.anomaly_events enable row level security;
alter table public.historical_points enable row level security;
alter table public.production_plans enable row level security;
alter table public.energy_records enable row level security;
alter table public.inventory_items enable row level security;
alter table public.operator_metrics enable row level security;
alter table public.optimization_recommendations enable row level security;
alter table public.root_cause_cases enable row level security;
alter table public.shift_handover_reports enable row level security;
alter table public.compliance_entries enable row level security;
alter table public.genealogy_records enable row level security;
alter table public.spc_samples enable row level security;
alter table public.advanced_feature_modules enable row level security;
alter table public.innovation_ideas enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'operator')
  )
  on conflict (id) do update
    set full_name = excluded.full_name,
        role = excluded.role;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "public_read_facilities" on public.facilities;
create policy "public_read_facilities"
on public.facilities
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_lines" on public.production_lines;
create policy "public_read_lines"
on public.production_lines
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_equipment" on public.equipment;
create policy "public_read_equipment"
on public.equipment
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_alerts" on public.alerts;
create policy "public_read_alerts"
on public.alerts
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_maintenance" on public.maintenance_predictions;
create policy "public_read_maintenance"
on public.maintenance_predictions
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_quality" on public.quality_events;
create policy "public_read_quality"
on public.quality_events
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_connectors" on public.connector_statuses;
create policy "public_read_connectors"
on public.connector_statuses
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_kpis" on public.custom_kpis;
create policy "public_read_kpis"
on public.custom_kpis
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_anomaly_events" on public.anomaly_events;
create policy "public_read_anomaly_events"
on public.anomaly_events
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_historical_points" on public.historical_points;
create policy "public_read_historical_points"
on public.historical_points
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_production_plans" on public.production_plans;
create policy "public_read_production_plans"
on public.production_plans
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_energy_records" on public.energy_records;
create policy "public_read_energy_records"
on public.energy_records
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_inventory_items" on public.inventory_items;
create policy "public_read_inventory_items"
on public.inventory_items
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_operator_metrics" on public.operator_metrics;
create policy "public_read_operator_metrics"
on public.operator_metrics
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_optimization_recommendations" on public.optimization_recommendations;
create policy "public_read_optimization_recommendations"
on public.optimization_recommendations
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_root_cause_cases" on public.root_cause_cases;
create policy "public_read_root_cause_cases"
on public.root_cause_cases
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_shift_handover_reports" on public.shift_handover_reports;
create policy "public_read_shift_handover_reports"
on public.shift_handover_reports
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_compliance_entries" on public.compliance_entries;
create policy "public_read_compliance_entries"
on public.compliance_entries
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_genealogy_records" on public.genealogy_records;
create policy "public_read_genealogy_records"
on public.genealogy_records
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_spc_samples" on public.spc_samples;
create policy "public_read_spc_samples"
on public.spc_samples
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_advanced_feature_modules" on public.advanced_feature_modules;
create policy "public_read_advanced_feature_modules"
on public.advanced_feature_modules
for select
to anon, authenticated
using (true);

drop policy if exists "public_read_innovation_ideas" on public.innovation_ideas;
create policy "public_read_innovation_ideas"
on public.innovation_ideas
for select
to anon, authenticated
using (true);
