// import React from "react";

export const registrationRequest = async (data) => {
  try {
    const response = await fetch("https://scpc-voting-api.onrender.com/api/v1/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(`message: ${responseData.message}`);
    console.log(`Error: ${responseData.error}`);

    return { response, responseData };
  } catch (error) {}
};

//   `https://scpc-voting-api.onrender.com/api/v1/user/validate/${token}`,

export const categoryRequest = async () => {
  try {
    const response = await fetch(
      `https://scpc-voting-api.onrender.com/api/v1/election/categories`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await response.json();

    return responseData;
  } catch (error) {}
};

export const validateStudent = async (token) => {
  const apiUrl = `https://scpc-voting-api.onrender.com/api/v1/user/validate/${token}`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    // console.log(responseData);

    return { response, responseData };
  } catch (error) {}
};

export const nomineeRequest = async (nomineeId) => {
  const apiUrl = `https://scpc-voting-api.onrender.com/api/v1/election/category/nominees/${nomineeId}`;
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();
    // console.log(responseData.rows);
    return { response, responseData };
  } catch (error) {}
};

export const vote = async (votingData) => {
  const apiUrl = `https://scpc-voting-api.onrender.com/api/v1/election/vote`;
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(votingData),
    });

    const responseData = await response.json();
    // console.log(responseData);
    return { response, responseData };
  } catch (error) {
    return error;
  }
};
