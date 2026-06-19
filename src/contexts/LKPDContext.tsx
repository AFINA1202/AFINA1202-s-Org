import { createContext, useContext, useState, ReactNode } from 'react';

interface LKPDContextType {
  data: Record<string, string>;
  updateData: (field: string, value: string) => void;
  setData: (data: Record<string, string>) => void;
}

const LKPDContext = createContext<LKPDContextType | undefined>(undefined);

export function LKPDProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Record<string, string>>({});

  const updateData = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <LKPDContext.Provider value={{ data, updateData, setData }}>
      {children}
    </LKPDContext.Provider>
  );
}

export function useLKPD() {
  const context = useContext(LKPDContext);
  if (context === undefined) {
    throw new Error('useLKPD must be used within a LKPDProvider');
  }
  return context;
}
