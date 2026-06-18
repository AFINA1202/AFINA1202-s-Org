import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import IntroStep from '../components/lkpd/IntroStep';
import Activity1Step from '../components/lkpd/Activity1Step';
import Activity2Step from '../components/lkpd/Activity2Step';
import Activity3Step from '../components/lkpd/Activity3Step';
import ConclusionStep from '../components/lkpd/ConclusionStep';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function StudentLKPD() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Pendahuluan', component: IntroStep },
    { title: 'Aktivitas 1: Eksplorasi', component: Activity1Step },
    { title: 'Aktivitas 2: Kolaborasi AI', component: Activity2Step },
    { title: 'Aktivitas 3: Python', component: Activity3Step },
    { title: 'Kesimpulan Akhir', component: ConclusionStep },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Progress Bar */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{steps[currentStep].title}</h2>
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 -z-10 rounded transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                idx < currentStep ? 'bg-emerald-500 border-emerald-500 text-white' : 
                idx === currentStep ? 'bg-white border-emerald-500 text-emerald-600' : 
                'bg-white border-slate-300 text-slate-400'
              }`}
            >
              {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        <CurrentComponent />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 px-8 z-20">
        <div className="max-w-5xl mx-auto w-full flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Sebelumnya
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} className="flex items-center bg-emerald-600 hover:bg-emerald-700">
              Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button className="flex items-center bg-indigo-600 hover:bg-indigo-700">
              Kirim E-LKPD <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
