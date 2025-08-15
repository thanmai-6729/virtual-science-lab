const fetch = require('node-fetch');
require('dotenv').config(); // Make sure you have a .env file with your API key

const API_URL = "https://api-inference.huggingface.co/models/distilgpt2";
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN; // Your token in .env

async function query(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  return result;
}

async function run() {
  const payload = {
    inputs: "Explain gravity in simple terms."
  };

  try {
    const result = await query(payload);
    console.log("Hugging Face API response:", result);
  } catch (error) {
    console.error("Error querying the API:", error);
  }
}

run();
