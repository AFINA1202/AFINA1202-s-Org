import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Copy, ExternalLink, Bot } from 'lucide-react';

export default function Activity2Step() {
  const [copied, setCopied] = useState(false);
  const promptText = "Tolong hitungkan nilai korelasi dan persamaan regresi linear sederhana antara data curah hujan (sebagai X) dan hasil panen kacang mete (sebagai Y) untuk dua desa berikut.\n\nData Wonosari:\n2020: X=2800, Y=520\n2021: X=2500, Y=570\n2022: X=2300, Y=640\n2023: X=2100, Y=710\n2024: X=2600, Y=600\n\nData Jedong:\n2020: X=3000, Y=480\n2021: X=2700, Y=530\n2022: X=2400, Y=610\n2023: X=2000, Y=750\n2024: X=2200, Y=680\n\nJelaskan maknanya.";

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-indigo-100 rounded-lg shrink-0">
              <Bot className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Kolaborasi dengan Kecerdasan Artifisial (KA)</h3>
              <p className="text-slate-600 leading-relaxed">
                KA mampu melakukan komputasi kompleks dengan sangat cepat. Namun untuk dapat bekerja secara optimal, ia memerlukan instruksi (prompt) yang jelas berserta konteks data yang akurat. Mari asah kemampuan merancang prompt Anda (Prompt Engineering). 
              </p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl overflow-hidden mt-8">
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-700 bg-slate-800">
              <span className="text-sm font-medium text-slate-300">Prompt Bantuan Analisis KA</span>
              <Button size="sm" variant="outline" className="h-8 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={handleCopy}>
                {copied ? <span className="text-emerald-400">Tersalin!</span> : <><Copy className="w-3 h-3 mr-2" /> Salin Teks</>}
              </Button>
            </div>
            <div className="p-4 text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {promptText}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <a href="https://chat.openai.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Buka ChatGPT <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <a href="https://gemini.google.com/" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Buka Google Gemini <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tabel Perbandingan Hasil</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-6">Pindahkan hasil analisis dari KA ke dalam tabel ini untuk membandingkan dengan hasil hitungan manual Anda, lalu tuliskan refleksinya.</p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-100 border-t border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-1/4">Komponen</th>
                  <th className="px-4 py-3 w-3/8 border-l border-slate-200">Desa Wonosari</th>
                  <th className="px-4 py-3 w-3/8 border-l border-slate-200">Desa Jedong</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-medium bg-slate-50">Nilai r (Hitungan KA)</td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" placeholder="..." /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" placeholder="..." /></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-medium bg-slate-50">Persamaan Regresi (KA)</td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" placeholder="..." /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" placeholder="..." /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Adakah perbedaan antara hasil hitungan manual Anda dan KA? Mengapa bisa terjadi perbedaan?</label>
              <textarea className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[100px]" placeholder="Tuliskan analisis atau refleksi Anda di sini..."></textarea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
