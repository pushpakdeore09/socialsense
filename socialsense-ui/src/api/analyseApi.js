import { apiClient, mlModelApiClient } from "./apiClient";
import useAnalysisId from "../store/useAnalysis";

export const firstStagePrediction = async (data) => {
  try {
    const payload = {
      ...data,
      gender:
        data.gender?.charAt(0).toUpperCase() +
        data.gender?.slice(1).toLowerCase(),
      
    };

    const response = await mlModelApiClient.post("/stage-one", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const secondStagePrediction = async (data) => {

  try {
    const response = await mlModelApiClient.post(
      "/stage-two",
      data,
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const saveStage1Analysis = async (payload, token) => {
  try {
    const response = await apiClient.post("/analysis/save-analysis/stage-one", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error saving analysis:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const saveStage2Analysis = async (data, token) => {
  try {
    const analysisId = useAnalysisId.getState().analysisId;
    const payload = {analysisId, stage2: data}
    const response = await apiClient.post("/analysis/save-analysis/stage-two", payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error saving analysis:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getUserAnalyses = async (userId, token) => {
  try {
    const response = await apiClient.get(`/analysis/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserAnalysis = async (analysisId, token) => {
  try {
    const response = await apiClient.delete(
      `/analysis/delete-analysis/${analysisId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    throw error;
  }
};

export const getAnalysis = async (analysisId, token) => {
  try {
    const response = await apiClient.get(
      `/analysis/get-analysis/${analysisId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
