# Documentação SQL: Estrutura de Perfis e Segurança

## 1. Tabela de Perfis Públicos
Cria uma tabela que estende a tabela interna `auth.users`. Isso permite armazenar dados adicionais (Nome, Bio) sem modificar o núcleo de autenticação.

```sql
-- Cria a tabela de perfis
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  bio text, -- Campo para a descrição minimalista
  avatar_url text,
  website text,

  primary key (id),
  constraint username_length check (char_length(username) >= 3)
);

-- Ativa Row Level Security (RLS) 
alter table public.profiles enable row level security;

-- POLÍTICAS DE SEGURANÇA (RLS)

-- 1. Leitura: Todo mundo pode ler perfis (Dados Abertos)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- 2. Inserção: O usuário pode inserir seu próprio perfil
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

-- 3. Atualização: Apenas o dono do perfil pode editá-lo
create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );
```

## 2. Automação (Triggers)
Este gatilho garante a integridade referencial: assim que um usuário se cadastra via email/senha, uma entrada correspondente é criada na tabela public.profiles.

```sql
-- Função que será executada pelo Trigger
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- O Trigger propriamente dito
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```