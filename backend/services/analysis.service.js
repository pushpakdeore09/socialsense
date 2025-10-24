import Analysis from "../models/analysis.model.js";

export const createAnalysis = async (data) => {
  const { userId, text, age, gender, stage1, stage2 } = data;

  const analysis = new Analysis({
    userId,
    text,
    age,
    gender,
    stage1,       
    stage2: stage2 || undefined, 
  });

  await analysis.save();
  return analysis;
};

export const getAnalysesByUser = async (userId) => {
    const analyses = await Analysis.find({userId}).sort({createdAt: -1});
    return analyses;
}