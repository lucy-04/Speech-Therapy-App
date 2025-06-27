const { GoogleGenAI } = require("@google/genai");
const GEMINI_API_KEY = require("./keys/GeminiApiKey.js");

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main(lettersString) {
    const prompt = `
You are a Hindi speech therapist. The student made mistakes on these letters: ${lettersString}.
Please generate 5 simple Hindi words to help them practice these letters.
Return only a JSON array of words, nothing else.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  console.log(response.text);
  const text = response.text;

  try {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const words = JSON.parse(cleaned);
  console.log("Generated words:", words);
} catch (err) {
  console.error("Could not parse JSON from Gemini:", text);
}
}

main("क");