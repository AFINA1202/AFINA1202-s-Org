import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Lightbulb } from 'lucide-react';

export default function ConclusionStep() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="p-4 bg-amber-100 rounded-full">
              <Lightbulb className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Sintesis dan Kesimpulan Akhir</h3>
            <p className="text-slate-600 max-w-2xl">
              Anda telah melewati proses panjang! Mulai dari menggambar plot titik, menghitung rumus secara manual, memverifikasi dengan Kecerdasan Artifisial, hingga membuat skrip otomasi dengan Python. Sekarang saatnya menyimpulkan.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">1. Berdasarkan nilai R² dan Koefisien, apakah perhitungan Python lebih akurat dari pengerjaan manual? Mengapa bisa demikian?</label>
              <textarea 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[100px] bg-white text-slate-700" 
                placeholder="Tuliskan alasan Anda..."
              ></textarea>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">2. Pertanyaan Utama: Wilayah manakah yang hasil panen mete-nya lebih dipengaruhi oleh intensitas curah hujan? (Wonosari yang datar, atau Jedong yang berbukit?)</label>
              <textarea 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[120px] bg-white text-slate-700" 
                placeholder="Sebutkan desanya dan jelaskan alasannya berdasarkan data yang sudah Anda proses..."
              ></textarea>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-slate-500 italic">
            "Matematika dan teknologi adalah alat bagi manusia untuk lebih memahami alam dan membantu sesama. Mengolah data cuaca bukan sekadar angka, melainkan prediksi kesejahteraan petani mete esok hari."
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
