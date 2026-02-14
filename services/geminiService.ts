
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly for initialization as per guidelines.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateGlasses = async (description: string, imageUrl?: string) => {
  const ai = getAI();
  const prompt = `
    請分析以下捐贈的舊眼鏡。
    描述：${description}
    根據潛在的社會影響力（幫助需要視力矯正的人）計算一個「時間幣 (Time Credit)」價值。
    請以 JSON 格式返回結果，包含以下屬性：
    'credits' (數字 10-100), 
    'impactSummary' (字串，請用繁體中文說明影響力), 
    'verificationChecklist' (字串陣列，請用繁體中文列出查驗清單)。
  `;

  const contents: any = [{ text: prompt }];
  if (imageUrl) {
    contents.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageUrl.split(',')[1]
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contents },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          credits: { type: Type.NUMBER },
          impactSummary: { type: Type.STRING },
          verificationChecklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["credits", "impactSummary", "verificationChecklist"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateTravelAdvice = async (location: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請針對在 ${location} 的住宿，為重視社區與永續發展的「時間銀行」會員提供 3 個簡短的旅行建議。請使用繁體中文。`,
  });
  return response.text;
};

// 新增：分析評論並產生社區價值標籤
export const summarizeFeedback = async (comment: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `請分析這段旅客評論，並提取 3 個關於住宿體驗的核心標籤（例如：寧靜、永續生活、房東熱情）。評論內容：${comment}。請以 JSON 陣列格式返回三個標籤字串。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || '[]');
};
