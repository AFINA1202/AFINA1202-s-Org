import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Download, ExternalLink, Terminal, Copy } from 'lucide-react';
import { useLKPD } from '../../contexts/LKPDContext';

export default function Activity3Step() {
  const [copied, setCopied] = useState(false);
  const { data: lkpdData, updateData } = useLKPD();

  // Generate CSV content
  const csvContent = `Wilayah,Curah_Hujan,Hasil_Panen
Jedong,3000,480
Jedong,2700,530
Jedong,2400,610
Jedong,2000,750
Jedong,2200,680
Wonosari,2800,520
Wonosari,2500,570
Wonosari,2300,640
Wonosari,2100,710
Wonosari,2600,600`;

  const pythonCode = `import pandas as pd
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
import io

# Pastikan Anda telah mengunggah file data_kacang_mete.csv
from google.colab import files
uploaded = files.upload()

for filename in uploaded.keys():
    data = pd.read_csv(io.BytesIO(uploaded[filename]))

data_jedong = data[data['Wilayah'] == 'Jedong']
data_wonosari = data[data['Wilayah'] == 'Wonosari']

def analisis_regresi(df, wilayah):
    X = df[['Curah_Hujan']]
    y = df['Hasil_Panen']
    
    model = LinearRegression()
    model.fit(X, y)
    
    print(f"\\n=== Hasil Regresi {wilayah} ===")
    print(f"Koefisien (Sensitivitas thdp hujan): {model.coef_[0]:.2f}")
    print(f"Intercept (Dasar panen): {model.intercept_:.2f}")
    print(f"Skor R^2 (Akurasi model): {model.score(X, y):.2f}")
    
    plt.figure(figsize=(8,5))
    plt.scatter(X, y, color='blue', label='Data Asli')
    plt.plot(X, model.predict(X), color='red', label='Garis Regresi')
    plt.title(f'Regresi Linier Curah Hujan thdp Hasil Panen - {wilayah}')
    plt.xlabel('Curah Hujan (mm)')
    plt.ylabel('Hasil Panen (kg/ha)')
    plt.legend()
    plt.grid(True)
    plt.show()

# Jalankan analisis untuk kedua desa
analisis_regresi(data_jedong, 'Jedong')
analisis_regresi(data_wonosari, 'Wonosari')`;

  const handleDownloadCSV = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data_kacang_mete.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg shrink-0">
              <Terminal className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Automasi Analisis Data dengan Python</h3>
              <p className="text-slate-600 leading-relaxed">
                Daripada menghitung manual menggunakan rumus, Data Scientist profesional menggunakan bahasa pemrograman seperti Python untuk mencari pola dalam ribuan baris data seketika. Mari kita bangun program regresi linear pertama Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm mr-3">1</span>
                Siapkan Dataset
              </h4>
              <p className="text-sm text-slate-600 mb-4">Unduh tabel mentah (CSV) yang memuat data petani Kacang Mete di Jedong dan Wonosari.</p>
              <Button onClick={handleDownloadCSV} className="w-full">
                <Download className="w-4 h-4 mr-2" /> Unduh data_kacang_mete.csv
              </Button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm mr-3">2</span>
                Buka Lingkungan Python
              </h4>
              <p className="text-sm text-slate-600 mb-4">Buka Google Colab di tab baru. Platform ini memungkinkan Anda menjalankan kode Python langsung dari browser.</p>
              <a href="https://colab.research.google.com/" target="_blank" rel="noreferrer" className="flex items-center justify-center w-full h-10 px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                Buka Google Colab <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>

          <div className="mt-8 relative hidden md:block">
            <div className="absolute left-[31px] top-6 bottom-0 w-px bg-slate-200"></div>
            <div className="relative z-10">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center bg-white py-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-sm mr-3">3</span>
                Salin dan Jalankan Skrip
              </h4>
              <p className="text-sm text-slate-600 mb-4 ml-9">Salin kode ini, tempel ke Colab, lalu jalankan. Saat diminta, unggah file CSV yang baru saja Anda unduh.</p>
              
              <div className="bg-slate-900 rounded-xl overflow-hidden ml-9 relative group">
                <div className="absolute right-4 top-4">
                  <Button size="sm" variant="outline" className="h-8 border-slate-600/50 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white" onClick={handleCopyCode}>
                    {copied ? <span className="text-emerald-400">Tersalin!</span> : <><Copy className="w-3 h-3 mr-2" /> Salin Code Python</>}
                  </Button>
                </div>
                <pre className="p-6 text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto">
                  <code>{pythonCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ekstraksi Hasil Pemrograman</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-6">Pindahkan output dari terminal Google Colab ke dalam tabel ini.</p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-100 border-t border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 w-1/5">Wilayah</th>
                  <th className="px-4 py-3 border-l border-slate-200">Koefisien (Kemiringan)</th>
                  <th className="px-4 py-3 border-l border-slate-200">Intercept (Memotong Y)</th>
                  <th className="px-4 py-3 border-l border-slate-200">Skor R² (Kekuatan)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-medium bg-slate-50">Jedong</td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_jedong_coef'] || ''} onChange={(e) => updateData('activity3_jedong_coef', e.target.value)} /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_jedong_inter'] || ''} onChange={(e) => updateData('activity3_jedong_inter', e.target.value)} /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_jedong_r2'] || ''} onChange={(e) => updateData('activity3_jedong_r2', e.target.value)} /></td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="px-4 py-3 font-medium bg-slate-50">Wonosari</td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_wonosari_coef'] || ''} onChange={(e) => updateData('activity3_wonosari_coef', e.target.value)} /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_wonosari_inter'] || ''} onChange={(e) => updateData('activity3_wonosari_inter', e.target.value)} /></td>
                  <td className="px-4 py-2 border-l border-slate-200"><input type="text" className="w-full bg-transparent outline-none focus:border-b-2 focus:border-emerald-500 py-1" value={lkpdData['activity3_wonosari_r2'] || ''} onChange={(e) => updateData('activity3_wonosari_r2', e.target.value)} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
