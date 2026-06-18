import { useAuth } from '../contexts/AuthContext';
import { LogOut, BookOpen } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut, settings } = useAuth();
  
  const themeClasses: Record<string, string> = {
    emerald: 'bg-emerald-700',
    blue: 'bg-blue-700',
    indigo: 'bg-indigo-700',
    slate: 'bg-slate-800',
  };
  
  const headerClass = `${themeClasses[settings?.themeColor] || themeClasses['emerald']} text-white shadow-md z-10 sticky top-0`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                ) : (
                  <BookOpen className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">E-LKPD MEKAR</h1>
                <p className="text-xs text-white/80 hidden sm:block">Mete, Koding, dan Analisis Regresi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-white/80 capitalize">{user?.role}</div>
              </div>
              <button 
                onClick={signOut}
                className="p-2 hover:bg-black/10 rounded-full transition-colors"
                title="Keluar"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} E-LKPD MEKAR - SMAN 1 Ngoro
        </div>
      </footer>
    </div>
  );
}
