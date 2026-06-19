import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Users, FileText, CheckCircle, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  student_id: string;
  student_name: string;
  data: Record<string, string>;
  status: 'draft' | 'submitted' | 'graded';
}

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
    
    // Simple realtime setup
    const channel = supabase
      .channel('public:lkpd_submissions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lkpd_submissions' }, payload => {
        fetchSubmissions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    }
  }, []);

  async function fetchSubmissions() {
    const { data, error } = await supabase
      .from('lkpd_submissions')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (data) {
      setSubmissions(data);
    }
  }

  const completedCount = submissions.filter(s => s.status === 'graded').length;
  const processingCount = submissions.filter(s => s.status === 'submitted' || s.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Dasbor Guru</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Akun E-LKPD Aktif</p>
              <h3 className="text-2xl font-bold text-slate-900">{submissions.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">E-LKPD Diproses/Disubmit</p>
              <h3 className="text-2xl font-bold text-slate-900">{processingCount}</h3>
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
              <h3 className="text-2xl font-bold text-emerald-600">{completedCount}</h3>
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
                  <th className="px-6 py-3 rounded-tr-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-slate-500 italic">Belum ada siswa yang mulai mengerjakan</td>
                  </tr>
                ) : submissions.map((student) => (
                  <tr key={student.id} className="bg-white border-b hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{student.student_name}</td>
                    <td className="px-6 py-4">
                      {student.status === 'submitted' && <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded border border-amber-200">Perlu Dinilai</span>}
                      {student.status === 'draft' && <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-0.5 rounded border border-slate-200">Mengerjakan</span>}
                      {student.status === 'graded' && <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded border border-emerald-200">Selesai</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(student)}>
                        Lihat Jawaban
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Modal View */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-800">Review E-LKPD: {selectedSubmission.student_name}</h3>
              <button className="p-2 hover:bg-slate-100 rounded-full" onClick={() => setSelectedSubmission(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto w-full flex-grow space-y-6">
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Aktivitas 1: Perhitungan Manual</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">r Wonosari:</span> {selectedSubmission.data['activity1_wonosari_r'] || '-'}</div>
                  <div><span className="font-medium">r Jedong:</span> {selectedSubmission.data['activity1_jedong_r'] || '-'}</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Aktivitas 2: AI Prompt</h4>
                <div className="mb-4">
                  <p className="font-medium text-sm text-slate-800 mb-1">Analisis Perbedaan:</p>
                  <p className="text-slate-600 text-sm whitespace-pre-wrap bg-white p-3 border border-slate-200 rounded min-h-[40px]">{selectedSubmission.data['activity2_answer'] || '<kosong>'}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Aktivitas 3: Hasil Python</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div><strong className="text-slate-800 mb-2 block">Jedong:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Coef: {selectedSubmission.data['activity3_jedong_coef'] || '-'}</li>
                        <li>Inter: {selectedSubmission.data['activity3_jedong_inter'] || '-'}</li>
                        <li>R2: {selectedSubmission.data['activity3_jedong_r2'] || '-'}</li>
                      </ul>
                   </div>
                   <div><strong className="text-slate-800 mb-2 block">Wonosari:</strong>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Coef: {selectedSubmission.data['activity3_wonosari_coef'] || '-'}</li>
                        <li>Inter: {selectedSubmission.data['activity3_wonosari_inter'] || '-'}</li>
                        <li>R2: {selectedSubmission.data['activity3_wonosari_r2'] || '-'}</li>
                      </ul>
                   </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-3 border-b pb-2">Kesimpulan Akhir</h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-sm text-slate-800 mb-1">Akurasi Python vs Manual:</p>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap bg-white p-3 border border-slate-200 rounded min-h-[40px]">{selectedSubmission.data['conclusion_1'] || '<kosong>'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-800 mb-1">Desa Paling Terdampak:</p>
                    <p className="text-slate-600 text-sm whitespace-pre-wrap bg-white p-3 border border-slate-200 rounded min-h-[40px]">{selectedSubmission.data['conclusion_2'] || '<kosong>'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
