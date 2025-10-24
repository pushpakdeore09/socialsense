import apiClient from './apiClient'; 

const {mlModelApiClient} = apiClient;

export const firstStagePrediction = async (data) => {
  try {
    const payload = {
      ...data,
      gender: data.gender?.charAt(0).toUpperCase() + data.gender?.slice(1).toLowerCase(),
      age_category: data.age_category
        ?.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    };

    const response = await mlModelApiClient.post("/stage-one", payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const saveAnalysis = async (data) => {
  
}
