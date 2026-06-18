-- Jalankan script SQL ini di SQL Editor Supabase Anda untuk membuat tabel aplikasi:

-- Tabel untuk menyimpan role pengguna
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid references auth.users on delete cascade not null primary key,
  role text not null check (role in ('admin', 'guru', 'siswa')),
  full_name text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mengaktifkan Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy
DROP POLICY IF EXISTS "Allow read all user_roles" ON public.user_roles;
CREATE POLICY "Allow read all user_roles" ON public.user_roles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update own role" ON public.user_roles;
CREATE POLICY "Allow update own role" ON public.user_roles FOR UPDATE USING (auth.uid() = id OR exists(select 1 from user_roles where id = auth.uid() and role = 'admin'));

DROP POLICY IF EXISTS "Allow insert own role" ON public.user_roles;
CREATE POLICY "Allow insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tabel untuk pengaturan situs (Logo, Tema)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer primary key default 1 check (id = 1),
  logo_url text,
  theme_color text default 'emerald',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read site_settings" ON public.site_settings;
CREATE POLICY "Allow read site_settings" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update site_settings" ON public.site_settings;
CREATE POLICY "Allow update site_settings" ON public.site_settings FOR UPDATE USING (exists(select 1 from user_roles where id = auth.uid() and role = 'admin'));

DROP POLICY IF EXISTS "Allow insert site_settings" ON public.site_settings;
CREATE POLICY "Allow insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (exists(select 1 from user_roles where id = auth.uid() and role = 'admin'));

-- Default settings
INSERT INTO public.site_settings (id, logo_url, theme_color) VALUES (1, '', 'emerald') ON CONFLICT (id) DO NOTHING;

-- Tabel untuk menyimpan pekerjaan E-LKPD siswa
CREATE TABLE IF NOT EXISTS public.lkpd_submissions (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users on delete cascade not null,
  student_name text not null,
  data jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'graded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

ALTER TABLE public.lkpd_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Siswa can view own submission" ON public.lkpd_submissions;
CREATE POLICY "Siswa can view own submission" ON public.lkpd_submissions FOR SELECT USING (auth.uid() = student_id OR exists(select 1 from user_roles where id = auth.uid() and role in ('admin', 'guru')));

DROP POLICY IF EXISTS "Siswa can insert own submission" ON public.lkpd_submissions;
CREATE POLICY "Siswa can insert own submission" ON public.lkpd_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Siswa can update own submission" ON public.lkpd_submissions;
CREATE POLICY "Siswa can update own submission" ON public.lkpd_submissions FOR UPDATE USING (auth.uid() = student_id);

-- Dummy users can be registered via Auth or we can mock auth for demo purposes if preferred.
