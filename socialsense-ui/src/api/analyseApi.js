import apiClient from "./apiClient";

const { backendApiClient, mlModelApiClient } = apiClient;

export const firstStagePrediction = async (data) => {
  try {
    const payload = {
      ...data,
      gender:
        data.gender?.charAt(0).toUpperCase() +
        data.gender?.slice(1).toLowerCase(),
      age_category: data.age_category
        ?.split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" "),
    };

    const response = await mlModelApiClient.post("/stage-one", payload, {
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const saveAnalysis = async (data, token) => {
  try {
    const response = await backendApiClient.post(
      "/analysis/save-analysis",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error saving analysis:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserAnalyses = async (userId, token) => {
  try {
    const response = await backendApiClient.get(`/analysis/user/${userId}`, {
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
    const response = await backendApiClient.delete(
    `/analysis/delete-analysis/${analysisId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  } catch (error) {
    throw error;
  }
};
