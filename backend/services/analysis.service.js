import Analysis from "../models/analysis.model.js";

export const createAnalysis = async (data) => {
  const { userId, text, age_group, gender, stage1, stage2 } = data;
  
  const analysis = new Analysis({
    userId,
    text,
    age_group,
    gender,
    stage1,
    stage2: stage2 || undefined,
  });

  await analysis.save();
  return analysis;
};

export const getAnalysesByUser = async (userId) => {
  const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 });
  return analyses;
};

export const deleteUserAnalysisService = async (analysisId) => {
  const deletedAnalysis = await Analysis.findByIdAndDelete(analysisId);

  if (!deletedAnalysis) {
    throw new Error("Analysis not found");
  }

  return { message: "Analysis deleted successfully" };
};

export const getAnalysis = async (analysisId) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) {
    throw new Error("Analysis not found");
  }
  return analysis;
};
