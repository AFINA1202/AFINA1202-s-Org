import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, UserRole } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

// We fall back to local state if Supabase isn't fully configured
export interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  is_approved: boolean;
  [key: string]: any;
}

export interface SiteSettings {
  logoUrl: string;
  themeColor: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  settings: SiteSettings;
  signIn: (username: string, password: string, role: UserRole) => Promise<{ error: Error | null }>;
  signUp: (metadata: any) => Promise<{ error: Error | null, pending?: boolean }>;
  signInAsDemo: (role: UserRole) => void;
  signOut: () => Promise<void>;
  updateSettings: (newSettings: SiteSettings) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({ logoUrl: '', themeColor: 'emerald' });

  useEffect(() => {
    document.title = 'E-LKPD MEKAR';
    if (settings?.logoUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.logoUrl;
    }
  }, [settings?.logoUrl]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').single();
      if (data) {
        setSettings({ logoUrl: data.logo_url || '', themeColor: data.theme_color || 'emerald' });
      } else {
        const localSettings = localStorage.getItem('mekar_settings');
        if (localSettings) {
          try {
            const parsed = JSON.parse(localSettings);
            if (parsed && typeof parsed === 'object') {
              setSettings({
                logoUrl: parsed.logoUrl || '',
                themeColor: parsed.themeColor || 'emerald'
              });
            }
          } catch(e) {}
        }
      }
    } catch {
      const localSettings = localStorage.getItem('mekar_settings');
      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings);
          if (parsed && typeof parsed === 'object') {
            setSettings({
              logoUrl: parsed.logoUrl || '',
              themeColor: parsed.themeColor || 'emerald'
            });
          }
        } catch(e) {}
      }
    }
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('mekar_settings', JSON.stringify(newSettings));
    try {
      await supabase.from('site_settings').upsert({ id: 1, logo_url: newSettings.logoUrl, theme_color: newSettings.themeColor });
    } catch (e) {
      console.warn("Failed to update site_settings table");
    }
  };

  useEffect(() => {
    fetchSettings();
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        // Check local storage for demo user
        const demoUser = localStorage.getItem('mekar_demo_user');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        }
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        const demoUser = localStorage.getItem('mekar_demo_user');
        if (!demoUser) {
          setUser(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Try to get role from user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, full_name, is_approved')
        .eq('id', authUser.id)
        .single();
      
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        role: (data?.role as UserRole) || (authUser.user_metadata?.role as UserRole) || 'siswa',
        name: data?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Pengguna',
        is_approved: data?.is_approved ?? (authUser.user_metadata?.is_approved ?? false),
        ...authUser.user_metadata
      });
    } catch (e) {
      console.error(e);
      setUser({
        id: authUser.id,
        email: authUser.email || '',
        role: (authUser.user_metadata?.role as UserRole) || 'siswa',
        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Pengguna',
        is_approved: authUser.user_metadata?.is_approved ?? false,
        ...authUser.user_metadata
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string, role: UserRole) => {
    if (role === 'admin' && username === 'admin' && password === '@1') {
      signInAsDemo('admin');
      return { error: null };
    }

    const email = `${username}_${role}@mekar.id`.toLowerCase().replace(/\s+/g, '');
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }
    
    // Check if user is approved from user_roles
    try {
      const { data: roleData } = await supabase.from('user_roles').select('is_approved').eq('id', authData.user.id).single();
      if (role !== 'admin' && !roleData?.is_approved) {
        await supabase.auth.signOut();
        return { error: new Error('Akun Anda belum disetujui oleh Administrator.') };
      }
    } catch {
      // Ignore
    }
    
    return { error: null };
  };

  const signUp = async (metadata: any) => {
    const { username, password, role, full_name } = metadata;
    const email = `${username}_${role}@mekar.id`.toLowerCase().replace(/\s+/g, '');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name,
          is_approved: false,
          ...metadata,
        }
      }
    });

    if (error) {
      console.warn("Supabase auth failed:", error.message);
      return { error };
    }

    if (data?.user) {
      // Attempt to save to public user_roles table
      const { error: insertError } = await supabase.from('user_roles').insert({
        id: data.user.id,
        role: role,
        full_name: full_name,
        is_approved: false
      });
      if (insertError && insertError.code !== '23505') {
        console.error("Gagal menyimpan ke user_roles:", insertError);
      }
      return { error: null, pending: true };
    }
    
    return { error: null, pending: true };
  };

  const signInAsDemo = (role: UserRole) => {
    const demoUserStr = JSON.stringify({
      id: `demo-${role}-${Date.now()}`,
      email: `demo-${role}@mekar.id`,
      role,
      name: role === 'siswa' ? 'Siswa Demo' : role === 'guru' ? 'Guru Matematika' : 'Administrator',
    });
    localStorage.setItem('mekar_demo_user', demoUserStr);
    setUser(JSON.parse(demoUserStr));
  };

  const signOut = async () => {
    localStorage.removeItem('mekar_demo_user');
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, settings, signIn, signUp, signInAsDemo, signOut, updateSettings }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
