-- Jalankan script ini di SQL Editor Supabase Anda untuk memastikan setiap akun yang didaftarkan langsung disinkronkan ke tabel user_roles.
-- Ini sangat penting untuk menghindari data pendaftar (siswa/guru) tidak muncul di Dashboard Admin.

-- 0. TAMBAHKAN KOLOM is_approved YANG HILANG DI TABEL user_roles (TERLIHAT DI SCREENSHOT ANDA)
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- 1. Buat fungsi untuk menyalin data dari auth.users ke public.user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, role, full_name, is_approved)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'role', 
    new.raw_user_meta_data->>'full_name', 
    false
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Buat trigger yang memanggil fungsi tersebut setiap kali ada akun baru
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- CATATAN PENTING:
-- Setelah Anda menjalankan script ini, setiap pendaftaran baru akan otomatis masuk ke tabel user_roles.
-- Selain itu, pastikan fitur "Confirm Email" di menu Authentication -> Providers -> Email di setting Supabase dimatikan (Disabled), agar siswa dan guru bisa langsung login setelah dikonfirmasi admin.
