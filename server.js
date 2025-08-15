require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_URL = "https://api-inference.huggingface.co/models/distilgpt2";
const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

async function queryHuggingFace(payload) {
  const response = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  return result;
}

app.post('/generate-explanation', async (req, res) => {
  try {
    const { domain, topic, type } = req.body;
    let prompt;
    if (type === 'simplified') {
      prompt = `Explain '${topic}' in the field of ${domain} in the simplest way possible for a beginner.`;
    } else {
      prompt = `Explain '${topic}' in the field of ${domain} in a detailed way.`;
    }

    const payload = { inputs: prompt };
    const result = await queryHuggingFace(payload);

    // This assumes the model returns text output in result. Adjust if needed.
    res.json({ explanation: result[0]?.generated_text || "No explanation generated." });
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({ error: "Error generating explanation" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
