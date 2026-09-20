import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { checkJwt } from '../middleware/authMiddleware';

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/generate', checkJwt, async (req, res) => {
  const userId = req.auth?.payload?.sub;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate AI content' });
  }
});

export default router;