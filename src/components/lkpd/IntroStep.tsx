import { Card, CardContent } from '../ui/Card';
import { PlayCircle } from 'lucide-react';

export default function IntroStep() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://lh3.googleusercontent.com/d/1qZfHyW8o-T_hhAAygjxkEnMpnOWU0fZT" 
                alt="Pertanian Mete Jedong" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden shadow-sm">
              <img 
                src="https://lh3.googleusercontent.com/d/1AzQkOwODJBsc1-aY9KoVGSR2XtXZ8ndu" 
                alt="Pertanian Mete Wonosari" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Mengenal Potensi Lokal: Kacang Mete</h3>
            <p className="text-slate-600 leading-relaxed text-lg mb-4 text-justify">
              Desa Jedong dan Wonosari, yang terletak di Kecamatan Ngoro, Kabupaten Mojokerto, dikenal sebagai dua daerah dengan potensi pertanian kacang mete yang cukup besar. Hamparan kebun mete yang tumbuh subur di lereng perbukitan menjadi sumber penghidupan bagi banyak keluarga di sekitar wilayah ini. Setiap tahun, para petani memanen biji mete yang nantinya dijual ke pasar lokal bahkan hingga ke luar daerah.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mb-4 text-justify">
              Meskipun sama-sama berada dalam satu kecamatan, jarak kedua desa ini mencapai sekitar 6 kilometer dengan kondisi geografis dan iklim mikro yang berbeda. Desa Wonosari terletak di daerah yang relatif lebih datar sedangkan Desa Jedong berada di wilayah yang lebih tinggi dan berbukit dengan udara yang lebih sejuk dan tingkat kelembapan yang berbeda.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg mb-4 text-justify">
              Perbedaan kondisi geografis ini sering menimbulkan variasi dalam hasil panen kacang mete. Beberapa tahun menunjukkan hasil panen yang tinggi di Wonosari, sementara Jedong justru mengalami penurunan dan begitu pula sebaliknya. Masyarakat setempat menduga bahwa faktor cuaca, terutama curah hujan tahunan, sangat memengaruhi produktivitas mete.
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
