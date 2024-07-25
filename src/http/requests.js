import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_USERNAME = process.env.REACT_APP_API_USERNAME;
const API_PASSWORD = process.env.REACT_APP_API_PASSWORD;

const encodeCredentials = (username, password) => {
  return btoa(`${username}:${password}`);
};

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${encodeCredentials(API_USERNAME, API_PASSWORD)}`,
  },
});

export const registrationRequest = async (data) => {
  try {
    const response = await httpClient.post("/user", data);
    const responseData = response.data;

    console.log("responseData", responseData);
    console.log(`message: ${responseData.message}`);
    console.log(`Error: ${responseData.error}`);

    return { response, responseData };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const categoryRequest = async () => {
  try {
    const response = await httpClient.get("/election/categories");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const validateStudent = async (token) => {
  try {
    const response = await httpClient.get(`/user/validate/${token}`);
    return { response, responseData: response.data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const nomineeRequest = async (nomineeId) => {
  try {
    const response = await httpClient.get(
      `/election/category/nominees/${nomineeId}`,
    );
    return { response, responseData: response.data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const vote = async (votingData, token) => {
  try {
    const response = await httpClient.post("/election/vote", votingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { response, responseData: response.data };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
