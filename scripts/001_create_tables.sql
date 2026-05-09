-- Kullanıcı profilleri
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  selected_city text default 'istanbul',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Namaz takibi
create table if not exists public.prayer_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prayer_date date not null,
  fajr boolean default false,
  sunrise boolean default false,
  dhuhr boolean default false,
  asr boolean default false,
  maghrib boolean default false,
  isha boolean default false,
  created_at timestamp with time zone default now(),
  unique(user_id, prayer_date)
);

alter table public.prayer_tracking enable row level security;

create policy "prayer_tracking_select_own" on public.prayer_tracking for select using (auth.uid() = user_id);
create policy "prayer_tracking_insert_own" on public.prayer_tracking for insert with check (auth.uid() = user_id);
create policy "prayer_tracking_update_own" on public.prayer_tracking for update using (auth.uid() = user_id);
create policy "prayer_tracking_delete_own" on public.prayer_tracking for delete using (auth.uid() = user_id);

-- Tesbih sayacı
create table if not exists public.tasbih_counter (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  count integer default 0,
  target integer default 33,
  dhikr_type text default 'subhanallah',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.tasbih_counter enable row level security;

create policy "tasbih_counter_select_own" on public.tasbih_counter for select using (auth.uid() = user_id);
create policy "tasbih_counter_insert_own" on public.tasbih_counter for insert with check (auth.uid() = user_id);
create policy "tasbih_counter_update_own" on public.tasbih_counter for update using (auth.uid() = user_id);
create policy "tasbih_counter_delete_own" on public.tasbih_counter for delete using (auth.uid() = user_id);

-- Hatim takibi
create table if not exists public.hatim_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  juz_number integer not null check (juz_number >= 1 and juz_number <= 30),
  completed boolean default false,
  completed_at timestamp with time zone,
  week_start date not null,
  created_at timestamp with time zone default now(),
  unique(user_id, juz_number, week_start)
);

alter table public.hatim_tracking enable row level security;

create policy "hatim_tracking_select_own" on public.hatim_tracking for select using (auth.uid() = user_id);
create policy "hatim_tracking_insert_own" on public.hatim_tracking for insert with check (auth.uid() = user_id);
create policy "hatim_tracking_update_own" on public.hatim_tracking for update using (auth.uid() = user_id);
create policy "hatim_tracking_delete_own" on public.hatim_tracking for delete using (auth.uid() = user_id);

-- Günlük dua geçmişi
create table if not exists public.daily_dua_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dua_id text not null,
  viewed_at date not null default current_date,
  created_at timestamp with time zone default now(),
  unique(user_id, viewed_at)
);

alter table public.daily_dua_history enable row level security;

create policy "daily_dua_history_select_own" on public.daily_dua_history for select using (auth.uid() = user_id);
create policy "daily_dua_history_insert_own" on public.daily_dua_history for insert with check (auth.uid() = user_id);
create policy "daily_dua_history_update_own" on public.daily_dua_history for update using (auth.uid() = user_id);
create policy "daily_dua_history_delete_own" on public.daily_dua_history for delete using (auth.uid() = user_id);
