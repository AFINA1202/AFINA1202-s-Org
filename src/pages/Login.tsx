import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BookOpen, User, Users, Shield, ArrowLeft } from 'lucide-react';

type ViewMode = 'role_selection' | 'login' | 'register';

export default function Login() {
  const { user, signIn, signUp, settings } = useAuth();
  const [view, setView] = useState<ViewMode>('role_selection');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  // Login State
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regKelas, setRegKelas] = useState('X');
  const [regNomor, setRegNomor] = useState('1');
  const [regMapel, setRegMapel] = useState('Matematika');

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'guru') return <Navigate to="/guru" replace />;
    return <Navigate to="/lkpd" replace />;
  }

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    setView('login');
    setLoginError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);
    setLoginError('');

    const { error } = await signIn(loginUser, loginPass, selectedRole);
    if (error) {
      setLoginError(error.message || 'Username atau password salah.');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsLoading(true);
    setLoginError('');

    const metadata: any = {
      full_name: regFullName,
      username: regUser,
      password: regPass,
      role: selectedRole
    };

    if (selectedRole === 'siswa') {
      metadata.kelas = `${regKelas}-${regNomor}`;
      metadata.mapel = regMapel;
    } else if (selectedRole === 'guru') {
      metadata.mapel = regMapel;
    }

    const { error, pending } = await signUp(metadata);
    if (error) {
      setLoginError(error.message || 'Gagal membuat akun.');
    } else if (pending) {
      setLoginError('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan Admin.');
      // Switch back to login view after successful registration, but keep the success message
      setLoginUser(regUser);
      setLoginPass('');
      setTimeout(() => setView('login'), 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className={`mx-auto h-20 w-20 ${settings?.themeColor === 'emerald' ? 'bg-emerald-600' : settings?.themeColor === 'blue' ? 'bg-blue-600' : settings?.themeColor === 'indigo' ? 'bg-indigo-600' : 'bg-slate-800'} rounded-2xl flex items-center justify-center shadow-lg mb-6 overflow-hidden`}>
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="h-full w-full object-contain bg-white p-2" />
          ) : (
            <BookOpen className="h-10 w-10 text-white" />
          )}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">E-LKPD MEKAR</h2>
        <p className="mt-2 text-md text-slate-600">
          Mete, Koding, dan Analisis Regresi
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-0 shadow-xl ring-1 ring-black/5">
          {view === 'role_selection' && (
            <>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Pilih Peran Untuk Masuk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => selectRole('siswa')} 
                  className="w-full text-left justify-start h-14 bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 shadow-none"
                >
                  <User className="mr-4 h-6 w-6 text-emerald-600" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Masuk sebagai Siswa</span>
                    <span className="text-xs font-normal text-slate-500">Akses Modul & Kerjakan Tugas</span>
                  </div>
                </Button>

                <Button 
                  onClick={() => selectRole('guru')} 
                  className="w-full text-left justify-start h-14 bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 shadow-none"
                >
                  <Users className="mr-4 h-6 w-6 text-emerald-600" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Masuk sebagai Guru</span>
                    <span className="text-xs font-normal text-slate-500">Periksa Hasil & Nilai Siswa</span>
                  </div>
                </Button>

                <Button 
                  onClick={() => selectRole('admin')} 
                  className="w-full text-left justify-start h-14 bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:border-emerald-200 shadow-none"
                >
                  <Shield className="mr-4 h-6 w-6 text-emerald-600" />
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">Masuk sebagai Admin</span>
                    <span className="text-xs font-normal text-slate-500">Kelola Sistem & Akun</span>
                  </div>
                </Button>
              </CardContent>
            </>
          )}

          {view === 'login' && selectedRole && (
            <>
              <CardHeader className="pb-4 relative">
                <button 
                  onClick={() => setView('role_selection')} 
                  className="absolute left-6 top-6 text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <CardTitle className="text-xl text-center capitalize">Login {selectedRole}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div className={`text-sm font-medium text-center p-2 rounded ${loginError.includes('berhasil') ? 'text-emerald-700 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {loginError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      required
                      value={loginUser}
                      onChange={(e) => setLoginUser(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
                      placeholder="Masukkan username" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors" 
                      placeholder="Masukkan password" 
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full h-10 mt-2">
                    {isLoading ? 'Memuat...' : 'Masuk'}
                  </Button>

                  {selectedRole !== 'admin' && (
                    <div className="text-center mt-4">
                      <button 
                        type="button" 
                        onClick={() => { setView('register'); setLoginError(''); }}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Belum punya akun? Buat akun
                      </button>
                    </div>
                  )}
                </form>
              </CardContent>
            </>
          )}

          {view === 'register' && selectedRole && (
            <>
              <CardHeader className="pb-4 relative">
                <button 
                  onClick={() => setView('login')} 
                  className="absolute left-6 top-6 text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <CardTitle className="text-xl text-center capitalize">Daftar Akun {selectedRole}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {loginError && (
                    <div className={`text-sm font-medium text-center p-2 rounded ${loginError.includes('berhasil') ? 'text-emerald-700 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {loginError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama Panjang</label>
                    <input 
                      type="text" 
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      placeholder="Nama Lengkap Anda" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      required
                      value={regUser}
                      onChange={(e) => setRegUser(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      placeholder="Pilih username" 
                    />
                  </div>

                  {selectedRole === 'siswa' && (
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
                        <select 
                          value={regKelas}
                          onChange={(e) => setRegKelas(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                        >
                          <option value="X">X</option>
                          <option value="XI">XI</option>
                          <option value="XII">XII</option>
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Angka</label>
                        <select 
                          value={regNomor}
                          onChange={(e) => setRegNomor(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                        >
                          {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {(selectedRole === 'siswa' || selectedRole === 'guru') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                      <select 
                        value={regMapel}
                        onChange={(e) => setRegMapel(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                      >
                        <option value="Matematika">Matematika</option>
                        <option value="B. Indonesia">B. Indonesia</option>
                        <option value="B. Inggris">B. Inggris</option>
                        <option value="Seni Budaya">Seni Budaya</option>
                        <option value="IPA Terpadu">IPA Terpadu</option>
                        <option value="Lainnya">Lainnya...</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                      placeholder="Minimal 6 karakter" 
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full h-10 mt-4">
                    {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                  </Button>
                </form>
              </CardContent>
            </>
          )}

        </Card>
      </div>
    </div>
  );
}
