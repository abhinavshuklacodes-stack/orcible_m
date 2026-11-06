-- Orcible MVP schema
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run: every statement uses "if not exists" / "or replace" where possible.

-- 1. Tables -------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My workspace',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  provider text not null default 'ChatGPT',
  included boolean not null default true,
  done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tasks_project_id_idx on public.tasks (project_id);
create index if not exists projects_workspace_id_idx on public.projects (workspace_id);

-- 2. Row Level Security: every user can only ever see/edit their own rows --

alter table public.workspaces enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "Users manage their own workspaces" on public.workspaces;
create policy "Users manage their own workspaces" on public.workspaces
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Users manage their own projects" on public.projects;
create policy "Users manage their own projects" on public.projects
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Users manage their own tasks" on public.tasks;
create policy "Users manage their own tasks" on public.tasks
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- 3. Auto-provision a starter workspace + project when someone signs up ----

create or replace function public.handle_new_user()
returns trigger as $$
declare
  new_workspace_id uuid;
begin
  insert into public.workspaces (owner_id, name)
    values (new.id, 'My workspace')
    returning id into new_workspace_id;
  insert into public.projects (workspace_id, owner_id, name, position)
    values (new_workspace_id, new.id, 'My first project', 0);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
