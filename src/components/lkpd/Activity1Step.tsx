import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import ScatterPlotCanvas from './ScatterPlotCanvas';
import { useLKPD } from '../../contexts/LKPDContext';

const INITIAL_WONOSARI = [
  { tahun: 2020, hujan: 2800, panen: 520 },
  { tahun: 2021, hujan: 2500, panen: 570 },
  { tahun: 2022, hujan: 2300, panen: 640 },
  { tahun: 2023, hujan: 2100, panen: 710 },
  { tahun: 2024, hujan: 2600, panen: 600 },
];

const INITIAL_JEDONG = [
  { tahun: 2020, hujan: 3000, panen: 480 },
  { tahun: 2021, hujan: 2700, panen: 530 },
  { tahun: 2022, hujan: 2400, panen: 610 },
  { tahun: 2023, hujan: 2000, panen: 750 },
  { tahun: 2024, hujan: 2200, panen: 680 },
];

export default function Activity1Step() {
  const [activeTab, setActiveTab] = useState<'wonosari' | 'jedong'>('wonosari');
  const data = activeTab === 'wonosari' ? INITIAL_WONOSARI : INITIAL_JEDONG;
  const { data: lkpdData, updateData } = useLKPD();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-1 rounded-lg border border-slate-200 inline-flex">
        <button
          onClick={() => setActiveTab('wonosari')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'wonosari' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Desa Wonosari
        </button>
        <button
          onClick={() => setActiveTab('jedong')}
          className={`px-6 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'jedong' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Desa Jedong
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Tabel Data</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Tahun</th>
                  <th className="px-4 py-3">Hujan (mm)</th>
                  <th className="px-4 py-3">Panen (kg)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100">
                    <td className="px-4 py-3">{row.tahun}</td>
                    <td className="px-4 py-3 font-medium text-blue-600">{row.hujan}</td>
                    <td className="px-4 py-3 font-medium text-emerald-600">{row.panen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 text-sm text-slate-500 bg-blue-50 p-4 rounded-lg">
              <p><strong>Instruksi:</strong> Perhatikan data tabel di atas, lalu klik pada kanvas koordinat di samping untuk meletakkan titik plot sesuai data.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Kanvas Koordinat Interaktif</CardTitle>
          </CardHeader>
          <CardContent>
            <ScatterPlotCanvas 
              targetData={data} 
              id={activeTab} 
              title={`Diagram Pencar ${activeTab === 'wonosari' ? 'Wonosari' : 'Jedong'}`}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perhitungan Korelasi Manual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-6">Hitung koefisien korelasi (r) menggunakan rumus Pearson secara manual di buku tugas Anda, lalu masukkan hasil akhir di bawah ini untuk dicocokkan dengan sistem otomatis.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nilai <i>r</i> (Manual) Desa Wonosari</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Contoh: -0.85" 
                value={lkpdData['activity1_wonosari_r'] || ''}
                onChange={(e) => updateData('activity1_wonosari_r', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nilai <i>r</i> (Manual) Desa Jedong</label>
              <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Contoh: -0.85" 
                value={lkpdData['activity1_jedong_r'] || ''}
                onChange={(e) => updateData('activity1_jedong_r', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
