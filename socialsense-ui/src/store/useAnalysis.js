import {create} from "zustand";

const useAnalysis = create((set) => ({
  analysisId: null,                 
  setAnalysisId: (id) => set({ analysisId: id }),
  clearAnalysisId: () => set({ analysisId: null }) 
}));

export default useAnalysis;