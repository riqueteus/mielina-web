-- Historico seguro e padronizado: chat e triagem no Supabase (igual aos laudos)
-- Execute este arquivo no Supabase SQL Editor

-- 1) Chat: historico de mensagens por usuário (texto puro fica no Postgres, não no localStorage)
create table if not exists public.chat_mensagens (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in ('usuario','ia','sistema')),
  texto text not null,
  fontes jsonb,
  criado_em timestamptz not null default now()
);
create index if not exists idx_chat_mensagens_usuario on public.chat_mensagens(usuario_id, criado_em desc);

-- RLS chat
alter table public.chat_mensagens enable row level security;
drop policy if exists "chat_select_own" on public.chat_mensagens;
create policy "chat_select_own" on public.chat_mensagens for select using (auth.uid() = usuario_id);
drop policy if exists "chat_insert_own" on public.chat_mensagens;
create policy "chat_insert_own" on public.chat_mensagens for insert with check (auth.uid() = usuario_id);
drop policy if exists "chat_delete_own" on public.chat_mensagens;
create policy "chat_delete_own" on public.chat_mensagens for delete using (auth.uid() = usuario_id);

-- 2) Triagem: histórico padronizado (igual laudos, mas sem PDF)
create table if not exists public.triagem_resultados (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references auth.users(id) on delete cascade,
  percentual_risco numeric not null,
  nivel text not null check (nivel in ('baixo','moderado','alto')),
  mensagem text,
  dados jsonb, -- guarda o payload original se precisar auditar
  criado_em timestamptz not null default now()
);
create index if not exists idx_triagem_usuario on public.triagem_resultados(usuario_id, criado_em desc);

-- RLS triagem
alter table public.triagem_resultados enable row level security;
drop policy if exists "triagem_select_own" on public.triagem_resultados;
create policy "triagem_select_own" on public.triagem_resultados for select using (auth.uid() = usuario_id);
drop policy if exists "triagem_insert_own" on public.triagem_resultados;
create policy "triagem_insert_own" on public.triagem_resultados for insert with check (auth.uid() = usuario_id);
drop policy if exists "triagem_delete_own" on public.triagem_resultados;
create policy "triagem_delete_own" on public.triagem_resultados for delete using (auth.uid() = usuario_id);

-- Opcional: view unificada para /resultados (triagem + laudos)
-- Se quiser listar tudo junto, use UNION no backend, não precisa de view.
