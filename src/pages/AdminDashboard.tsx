import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Database, Server, Shield, Palette, Users as UsersIcon, Check, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const { settings, updateSettings } = useAuth();
  
  const [logoUrl, setLogoUrl] = useState(settings?.logoUrl || '');
  const [themeColor, setThemeColor] = useState(settings?.themeColor || 'emerald');
  const [isSaving, setIsSaving] = useState(false);
  
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const [approvedGurus, setApprovedGurus] = useState<any[]>([]);
  const [approvedSiswas, setApprovedSiswas] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Fetch from Supabase
      const { data } = await supabase.from('user_roles').select('*');
      
      // Also fetch from local storage for demo
      const localUsers = JSON.parse(localStorage.getItem('mekar_users') || '[]');
      
      const allUsers = [...(data || []), ...localUsers].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
      
      setPendingUsers(allUsers.filter(u => !u.is_approved && u.role !== 'admin'));
      setApprovedGurus(allUsers.filter(u => u.is_approved && u.role === 'guru'));
      setApprovedSiswas(allUsers.filter(u => u.is_approved && u.role === 'siswa'));
    } catch {
      const localUsers = JSON.parse(localStorage.getItem('mekar_users') || '[]');
      setPendingUsers(localUsers.filter((u: any) => !u.is_approved && u.role !== 'admin'));
      setApprovedGurus(localUsers.filter((u: any) => u.is_approved && u.role === 'guru'));
      setApprovedSiswas(localUsers.filter((u: any) => u.is_approved && u.role === 'siswa'));
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    await updateSettings({ logoUrl, themeColor });
    setIsSaving(false);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleApprove = async (userId: string, isLocal: boolean) => {
    try {
      if (isLocal) {
        const localUsers = JSON.parse(localStorage.getItem('mekar_users') || '[]');
        const updated = localUsers.map((u: any) => u.id === userId ? { ...u, is_approved: true } : u);
        localStorage.setItem('mekar_users', JSON.stringify(updated));
      } else {
        await supabase.from('user_roles').update({ is_approved: true }).eq('id', userId);
      }
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert('Gagal menyetujui pengguna');
    }
  };

  const handleReject = async (userId: string, isLocal: boolean) => {
    if (!confirm('Apakah Anda yakin ingin menolak dan menghapus pengguna ini?')) return;
    try {
      if (isLocal) {
        const localUsers = JSON.parse(localStorage.getItem('mekar_users') || '[]');
        const updated = localUsers.filter((u: any) => u.id !== userId);
        localStorage.setItem('mekar_users', JSON.stringify(updated));
      } else {
        await supabase.from('user_roles').delete().eq('id', userId);
      }
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus pengguna');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Dasbor Administrator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-emerald-600" />
              Konfigurasi Tampilan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Logo Aplikasi</label>
              <input 
                type="text" 
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none" 
                placeholder="https://example.com/logo.png" 
              />
              {logoUrl && (
                <div className="mt-2 p-2 bg-slate-50 border rounded-md inline-block">
                  <img src={logoUrl} alt="Preview" className="h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warna Tema Utama</label>
              <select 
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="emerald">Emerald (Hijau)</option>
                <option value="blue">Blue (Biru)</option>
                <option value="indigo">Indigo (Ungu Biru)</option>
                <option value="slate">Slate (Abu Tua)</option>
              </select>
            </div>
            
            <Button onClick={handleSaveSettings} disabled={isSaving} className="mt-2">
              {isSaving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
              Persetujuan Pendaftaran ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-4 text-slate-500">Memuat data...</div>
            ) : pendingUsers.length === 0 ? (
              <div className="text-center py-4 text-slate-500 border border-dashed rounded-md bg-slate-50">
                Tidak ada pendaftar baru yang menunggu persetujuan.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {pendingUsers.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                    <div>
                      <div className="font-medium text-slate-900">{user.full_name || user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span className="capitalize bg-slate-100 px-2 py-0.5 rounded">{user.role}</span>
                        <span>{user.email || user.username}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(user.id, !!user.username)}>
                        <X className="w-4 h-4 mr-1" /> Tolak
                      </Button>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(user.id, !!user.username)}>
                        <Check className="w-4 h-4 mr-1" /> Setujui
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-emerald-600" />
              Daftar Guru ({approvedGurus.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-4 text-slate-500">Memuat data...</div>
            ) : approvedGurus.length === 0 ? (
              <div className="text-center py-4 text-slate-500 border border-dashed rounded-md bg-slate-50">
                Belum ada guru yang disetujui.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {approvedGurus.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                    <div>
                      <div className="font-medium text-slate-900">{user.full_name || user.name}</div>
                      <div className="text-xs text-slate-500">{user.email || user.username}</div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(user.id, !!user.username)}>
                        <X className="w-4 h-4" /> Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-indigo-600" />
              Daftar Siswa ({approvedSiswas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-4 text-slate-500">Memuat data...</div>
            ) : approvedSiswas.length === 0 ? (
              <div className="text-center py-4 text-slate-500 border border-dashed rounded-md bg-slate-50">
                Belum ada siswa yang disetujui.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {approvedSiswas.map(user => (
                  <div key={user.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                    <div>
                      <div className="font-medium text-slate-900">{user.full_name || user.name}</div>
                      <div className="text-xs text-slate-500">{user.email || user.username}</div>
                    </div>
                    <div>
                      <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleReject(user.id, !!user.username)}>
                        <X className="w-4 h-4" /> Hapus
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
