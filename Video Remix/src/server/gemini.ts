import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function parseWithGemini(command: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const prompt = `
You are an AI Video Editing Assistant.

Convert the user's command into JSON only.

Supported actions:

cut
trim
speed
subtitle
caption
watermark
audio

Return JSON like:

{
 "steps":[
   {
     "action":"cut",
     "seconds":5
   },
   {
     "action":"subtitle"
   },
   {
     "action":"watermark"
   }
 ]
}

User:

${command}
`;

  const result = await model.generateContent(prompt);

  return JSON.parse(result.response.text());
}