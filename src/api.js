require("dotenv").config();

/**
 * Function to call the Sympla API.
 * @param {string} path - The API endpoint to call.
 * @param {number} version - The API version to use (default is 4).
 * @returns {Promise<Object>} - The response from the API.
 */
const apiSympla = async (path, version = 4) => {
  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      `${process.env.SYMPLA_API_URL}/v${version}/${path}`,
      {
        headers: {
          s_token: process.env.SYMPLA_API_KEY,
        },
      }
    );
    if (!response.ok) {
      console.error("🚀 ~ Sympla API Error:", response)
      throw new Error(`Sympla API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in apiSympla: ${error}`);
    throw error;
  }
};

/**
 * Function to call the Protocol API.
 * @param {string} path - The API endpoint to call.
 * @param {string} method - The HTTP method to use (default is 'get').
 * @param {Object} body - The request body for POST requests.
 * @returns {Promise<Object>} - The response from the API.
 */
const apiProtocol = async (path, method = "get", body) => {
  try {
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      `${process.env.PROTOCOL_API_URL}/v1/${path}`,
      {
        method,
        body,
        headers: {
          accept: "application/json",
          "x-api-key": process.env.PROTOCOL_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("🚀 ~ Protocol API Error:", response)
      throw new Error(`Protocol API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in apiProtocol: ${error}`);
    throw error;
  }
};

module.exports = { apiSympla, apiProtocol };
