import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Users, FileText, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function TeacherDashboard() {
  // Dummy data
  const students = [
    { id: 1, name: 'Ahmad Faisal', status: 'submitted', score: 85 },
    { id: 2, name: 'Siti Nurhaliza', status: 'draft', score: null },
    { id: 3, name: 'Budi Santoso', status: 'graded', score: 92 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dasbor Guru</h2>
        <Button>Buat Akun Siswa</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Siswa (Kelas XI)</p>
              <h3 className="text-2xl font-bold text-slate-900">32</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">E-LKPD Diproses</p>
              <h3 className="text-2xl font-bold text-slate-900">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Selesai Dinilai</p>
              <h3 className="text-2xl font-bold text-emerald-600">8</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pekerjaan Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500">
              <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Nama Siswa</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Nilai</th>
                  <th className="px-6 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.name}</td>
                    <td className="px-6 py-4">
                      {student.status === 'submitted' && <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded border border-amber-200">Perlu Dinilai</span>}
                      {student.status === 'draft' && <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded border border-slate-200">Mengerjakan</span>}
                      {student.status === 'graded' && <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200">Selesai</span>}
                    </td>
                    <td className="px-6 py-4 font-bold">{student.score || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" disabled={student.status === 'draft'}>
                        Periksa Hasil
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
