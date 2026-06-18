import { Card, CardContent } from '../ui/Card';
import { PlayCircle } from 'lucide-react';

export default function IntroStep() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-8">
          <div className="aspect-video bg-slate-900 rounded-xl relative overflow-hidden flex items-center justify-center mb-8 group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1596484552834-6a58f4fa1859?q=80&w=1200&auto=format&fit=crop" 
              alt="Perkebunan Kacang Mete" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
            />
            <div className="relative z-10 flex flex-col items-center">
              <PlayCircle className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform" />
              <p className="text-white mt-4 font-medium tracking-wide">Tonton Pengantar: Bertani Mete di Ngoro</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Mengenal Potensi Lokal: Kacang Mete</h3>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              Desa Jedong dan Wonosari di Kecamatan Ngoro, Kabupaten Mojokerto dikenal sebagai daerah penghasil kacang mete. Hamparan kebun mete tumbuh subur di lereng perbukitan dan menjadi sumber penghidupan warga.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              Meski berdekatan (berjarak sekitar 6 km), kedua desa ini memiliki iklim mikro dan kontur geografis yang berbeda. Wonosari relatif datar, sedangkan Jedong lebih tinggi dan berbukit. Perbedaan kondisi ini memengaruhi hasil panen dari tahun ke tahun.
            </p>
            
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 mt-8">
              <h4 className="font-semibold text-emerald-800 text-xl mb-2">Pertanyaan Utama</h4>
              <p className="text-emerald-700">
                Apakah benar curah hujan memiliki pengaruh langsung terhadap hasil panen kacang mete? Bagaimana kita dapat menggunakan matematika dan teknologi untuk membuktikannya?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
