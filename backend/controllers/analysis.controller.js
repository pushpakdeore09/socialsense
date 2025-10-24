import * as analysisService from "../services/analysis.service.js";

export const saveAnalysisResult = async (req, res) => {
  try {
    const { userId, text, age, gender, stage1, stage2 } = req.body;

    if (!userId || !text || !age || !gender || !stage1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const analysis = await analysisService.createAnalysis({
      userId,
      text,
      age,
      gender,
      stage1,
      stage2,
    });

    return res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAnalyses = async () => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const analyses = await analysisService.getAnalysesByUser(userId);

    return res.status(200).json(analyses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
