import { createContext, useContext, useState, ReactNode } from "react";

interface AnalysisContextType {
  analysisResults: any | null;
  setAnalysisResults: (results: any) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined
);

export const AnalysisProvider = ({ children }: { children: ReactNode }) => {
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysisResults, setAnalysisResults }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};
