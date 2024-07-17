require('dotenv').config();

const fetch = require('node-fetch');

const apiSympla = async (path, version = 4) => {
  try {
    const response = await fetch(
      `${process.env.SYMPLA_API_URL}/v${version}/${path}`,
      {
        headers: {
          s_token: process.env.SYMPLA_API_KEY,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Sympla API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in apiSympla: ${error.message}`);
    throw error;
  }
};

const apiProtocol = async (path, method = 'get', body) => {
  try {
    const response = await fetch(`${process.env.PROTOCOL_API_URL}/v1/${path}`, {
      method,
      body,
      headers: {
        accept: 'application/json',
        'x-api-key': process.env.PROTOCOL_API_KEY,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) {
      throw new Error(`Protocol API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in apiProtocol: ${error.message}`);
    throw error;
  }
};

module.exports = { apiSympla, apiProtocol };
