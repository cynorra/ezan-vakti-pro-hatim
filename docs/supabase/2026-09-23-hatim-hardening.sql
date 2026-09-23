-- Ortak hatim tabloları için sağlamlaştırma (Supabase > SQL Editor'da tek seferde çalıştırın).
-- Tekrar çalıştırılabilir (idempotent). Tek bir transaction: bir adım hata verirse hiçbiri uygulanmaz.
--
-- Ne yapar:
--   1. Aynı cüzün birden fazla kez alındığı kayıtları temizler (en eskisini tutar)
--   2. Aynı hatimde bir cüzün yalnızca bir kez alınmasını veritabanı seviyesinde zorunlu kılar
--   3. Basit veri kontrolleri ekler (cüz 1-30, isim/başlık uzunluğu)
--   4. RLS: herkes okuyabilir ve ekleyebilir; kimse (anon anahtarla) kayıt DEĞİŞTİREMEZ veya SİLEMEZ
--
-- ÇALIŞTIRMADAN ÖNCE mevcut politikalara bakmak isterseniz:
--   select tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname = 'public'
--     and tablename in ('shared_hatims', 'shared_hatim_progress');
-- 4. adım bu iki tablodaki MEVCUT TÜM politikaları kaldırıp yerine aşağıdakileri koyar.

begin;

-- 1. Yinelenen cüz kayıtlarını temizle (her hatim + cüz için en eski kayıt kalır)
delete from public.shared_hatim_progress
where id in (
  select id
  from (
    select id,
           row_number() over (
             partition by hatim_id, juz_number
             order by completed_at nulls last, id
           ) as rn
    from public.shared_hatim_progress
  ) ranked
  where ranked.rn > 1
);

-- 2. Bir hatimde her cüz yalnızca bir kez alınabilir.
--    Uygulama bu kural ihlalinde (hata kodu 23505) "bu cüz az önce alındı" mesajı gösteriyor.
create unique index if not exists shared_hatim_progress_hatim_juz_key
  on public.shared_hatim_progress (hatim_id, juz_number);

-- 3. Veri kontrolleri
alter table public.shared_hatim_progress
  drop constraint if exists shared_hatim_progress_juz_range,
  add constraint shared_hatim_progress_juz_range check (juz_number between 1 and 30);

alter table public.shared_hatim_progress
  drop constraint if exists shared_hatim_progress_user_name_length,
  add constraint shared_hatim_progress_user_name_length
    check (user_name is null or char_length(user_name) <= 60);

alter table public.shared_hatims
  drop constraint if exists shared_hatims_title_length,
  add constraint shared_hatims_title_length check (char_length(title) between 1 and 120);

alter table public.shared_hatims
  drop constraint if exists shared_hatims_description_length,
  add constraint shared_hatims_description_length
    check (description is null or char_length(description) <= 500);

-- 4. Row Level Security
alter table public.shared_hatims enable row level security;
alter table public.shared_hatim_progress enable row level security;

-- Mevcut tüm politikaları kaldır (ör. "herkes silebilir" gibi eski/geniş kurallar kalmasın)
do $$
declare p record;
begin
  for p in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('shared_hatims', 'shared_hatim_progress')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

-- Hatimler: herkes okuyabilir
create policy shared_hatims_read on public.shared_hatims
  for select to anon, authenticated
  using (true);

-- Hatimler: herkes yeni hatim açabilir (bitiş tarihi gelecekte ve en fazla 1 yıl sonra olmalı)
create policy shared_hatims_insert on public.shared_hatims
  for insert to anon, authenticated
  with check (
    ends_at > now()
    and ends_at <= now() + interval '366 days'
    and coalesce(total_juz, 30) = 30
  );

-- Cüz kayıtları: herkes okuyabilir
create policy shared_hatim_progress_read on public.shared_hatim_progress
  for select to anon, authenticated
  using (true);

-- Cüz kayıtları: yalnızca süresi dolmamış bir hatime cüz alınabilir
create policy shared_hatim_progress_insert on public.shared_hatim_progress
  for insert to anon, authenticated
  with check (
    exists (
      select 1 from public.shared_hatims h
      where h.id = hatim_id
        and (h.ends_at is null or h.ends_at > now())
    )
  );

-- UPDATE ve DELETE için politika YOK: RLS açıkken bunlar anon/authenticated için reddedilir.
-- (Supabase panelinden veya service_role anahtarıyla yönetim yine mümkündür.)

commit;
