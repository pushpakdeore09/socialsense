import backendApiClient from "./apiClient";

export const registerUser = async (userData) => {
  try {
    const response = await backendApiClient.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await backendApiClient.post("/auth/login", userData)
    return response.data
  } catch (error) {
    throw error.response?.data || error;
  }
}
