import * as analysisService from "../services/analysis.service.js";
import { dbServiceStageTwo, recommendationService } from "../services/dbService.js";
import Analysis from "../models/analysis.model.js";
export const saveStage1AnalysisResult = async (req, res) => {
  try {
    const { userId, text, age_group, gender, stage1, stage2 } = req.body;

    if (!userId || !text || !age_group || !gender || !stage1) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const analysis = await analysisService.createAnalysis({
      userId,
      text,
      age_group,
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

export const saveStage2AnalysisResult = async (req, res) => {
  try {
    const { analysisId, stage2 } = req.body;
    const { probabilities, predicted_class } = stage2;
    
    if (!analysisId)
      return res.status(400).json({ message: "analysisId is required" });

    if (!predicted_class || !probabilities) {
      return res.status(400).json({ message: "Stage 2 result data missing" });
    }
    const response = await saveStageTwo(req.body);
    
    const confidenceData = {
      anxiety: response.probabilities[0] || 0,
      bipolar: response.probabilities[1] || 0,
      personalityDisorder: response.probabilities[2] || 0,
      stress: response.probabilities[3] || 0,
      suicidal: response.probabilities[4] || 0,
      none: 0,
    };
    const subClassMap = {
      0: "Anxiety",
      1: "Bipolar",
      2: "Personality disorder",
      3: "Stress",
      4: "Suicidal",
    };
    const updatedAnalysis = await Analysis.findByIdAndUpdate(
      analysisId,
      {
        $set: {
          stage2: {
            depressionType: subClassMap[response.prediction],
            confidence: confidenceData,
          },
          recommendation: response.recommendation

        },
      },
      { new: true },
    );
    
    return res.status(200).json(updatedAnalysis);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserAnalyses = async (req, res) => {
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

export const deleteUserAnalysis = async (req, res) => {
  try {
    const { analysisId } = req.params;

    const result = await analysisService.deleteUserAnalysisService(analysisId);
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { analysisId } = req.params;
    console.log(analysisId);

    const result = await analysisService.getAnalysis(analysisId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const saveStageTwo = async (data) => {
  try {
    const payload = data;
    
    const analysis = await analysisService.getAnalysis(data.analysisId);
    const stage2data = {
      text: analysis.text,
      prediction: payload.stage2.predicted_class,
      probabilities: payload.stage2.probabilities,
    };
    
    const response = await dbServiceStageTwo(stage2data);
    const recommendation = await recommendationService(response)
    return {...response, recommendation: recommendation}
  } catch (error) {
    console.log("error:", error);
  }
};

