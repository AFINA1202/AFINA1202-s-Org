import { useState, useRef, MouseEvent, useEffect } from 'react';
import { Button } from '../ui/Button';

interface DataPoint {
  hujan: number;
  panen: number;
}

interface ScatterPlotCanvasProps {
  targetData: DataPoint[];
  id: string;
  title: string;
}

export default function ScatterPlotCanvas({ targetData, id, title }: ScatterPlotCanvasProps) {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [showAuto, setShowAuto] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Reset points when tab changes
  useEffect(() => {
    setPoints([]);
    setShowAuto(false);
  }, [id]);

  const xMin = 2000, xMax = 3000;
  const yMin = 400, yMax = 800;
  
  const mapValueToCoordinate = (val: number, min: number, max: number, size: number) => {
    return ((val - min) / (max - min)) * size;
  };

  const handleSvgClick = (e: MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const yPos = e.clientY - rect.top;
    
    // Map back to value to snap or store
    const xVal = xMin + (xPos / rect.width) * (xMax - xMin);
    const yVal = yMax - (yPos / rect.height) * (yMax - yMin); // Y is inverted in SVG
    
    setPoints([...points, { x: xVal, y: yVal }]);
  };

  const handleClear = () => setPoints([]);

  return (
    <div className="flex flex-col items-center">
      <h4 className="font-semibold text-slate-700 mb-4">{title}</h4>
      
      <div className="relative w-full max-w-2xl aspect-video bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
        {/* Y Axis Label */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-slate-500 origin-center">
          Hasil Panen (kg/ha)
        </div>
        
        {/* SVG Canvas */}
        <div className="pl-12 pb-8 pt-4 pr-4 w-full h-full relative">
          <div className="relative w-full h-full">
            <svg 
              ref={svgRef}
              className="w-full h-full bg-white border-b-2 border-l-2 border-slate-300 cursor-crosshair relative z-10"
              onClick={handleSvgClick}
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
            >
              {/* Grid lines */}
              {[2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900].map(val => {
                const xInfo = mapValueToCoordinate(val, xMin, xMax, 1000);
                return <line key={val} x1={xInfo} y1="0" x2={xInfo} y2="400" stroke="#f1f5f9" strokeWidth="1"/>;
              })}
              {[500, 600, 700].map(val => {
                const yInfo = 400 - mapValueToCoordinate(val, yMin, yMax, 400);
                return <line key={val} x1="0" y1={yInfo} x2="1000" y2={yInfo} stroke="#f1f5f9" strokeWidth="1"/>;
              })}

              {/* Target Data (auto generated when toggle is on) */}
              {showAuto && targetData.map((d, i) => {
                const cx = mapValueToCoordinate(d.hujan, xMin, xMax, 1000);
                const cy = 400 - mapValueToCoordinate(d.panen, yMin, yMax, 400);
                return (
                  <circle key={`target-${i}`} cx={cx} cy={cy} r="6" fill="#10b981" />
                )
              })}

              {/* User plotted points */}
              {points.map((p, i) => {
                const cx = mapValueToCoordinate(p.x, xMin, xMax, 1000);
                const cy = 400 - mapValueToCoordinate(p.y, yMin, yMax, 400);
                return (
                  <circle key={`user-${i}`} cx={cx} cy={cy} r="5" fill="#ef4444" opacity="0.8" />
                )
              })}
            </svg>
            
            {/* Axis Labels (X) */}
            {[2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900].map(val => {
              const leftPercent = mapValueToCoordinate(val, xMin, xMax, 100);
              return (
                <div 
                  key={`lbl-x-${val}`} 
                  className="absolute bottom-0 text-[10px] text-slate-500 whitespace-nowrap" 
                  style={{ left: `${leftPercent}%`, transform: 'translate(-50%, 120%)' }}
                >
                  {val}
                </div>
              );
            })}
            
            {/* Axis Labels (Y) */}
            {[500, 600, 700].map(val => {
              const bottomPercent = mapValueToCoordinate(val, yMin, yMax, 100);
              return (
                <div 
                  key={`lbl-y-${val}`} 
                  className="absolute left-0 text-[10px] text-slate-500 whitespace-nowrap" 
                  style={{ bottom: `${bottomPercent}%`, transform: 'translate(-120%, 50%)' }}
                >
                  {val}
                </div>
              );
            })}
          </div>
          
          {/* X Axis Label */}
          <div className="absolute bottom-1 left-0 w-full text-center text-xs font-medium text-slate-500">
            Curah Hujan (mm)
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        <Button variant="outline" size="sm" onClick={handleClear}>
          Hapus Titik Saya
        </Button>
        <Button 
          variant={showAuto ? "secondary" : "default"} 
          size="sm" 
          onClick={() => setShowAuto(!showAuto)}
        >
          {showAuto ? 'Sembunyikan Titik Asli' : 'Bandingkan dengan Data Asli'}
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-slate-500 gap-4 flex w-full max-w-2xl justify-center">
         <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Titik yang Anda plot</div>
         <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Data sebenarnya</div>
      </div>
    </div>
  );
}
