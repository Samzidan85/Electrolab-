import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API endpoint for Smart Diagnostic Assistant using Gemini API
  app.post('/api/diagnose', async (req, res) => {
    try {
      const { deviceType, symptom, readings, context } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({
          isAi: false,
          message: 'Local Expert Diagnostic Rule Engine Active'
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a master electrical engineer, industrial generator mechanic, and PCB reverse-engineering expert.
Analyze this technical repair query with professional depth and practical bench accuracy:

- Equipment / Board: ${deviceType || 'Unspecified electrical equipment'}
- Observed Symptoms: ${symptom || 'No power / failure'}
- Multimeter / Scope Readings: ${readings || 'None provided'}
- Additional Details / Environment: ${context || 'Standard workshop environment'}

Provide an authoritative diagnostic breakdown with these exact sections:
1. Probable Root Cause (explain the exact physical or silicon failure mechanism).
2. Step-by-Step Test Procedure (which specific test points, probe polarities, DMM ranges: diode drop, Ω, VAC, VDC).
3. Secret Bench Hack / Shortcut (e.g., Rosin smoke, Dim bulb current limiter, Field flashing with 12V, Gate latch test).
4. Safety Protocol (Discharge capacitors, Galvanic isolation, Shock/Arc flash protection).
5. Recommended Replacement Components & Cross-References.

Keep it actionable, precise, and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({
        isAi: true,
        text: response.text || 'Diagnostic analysis completed.'
      });
    } catch (err: any) {
      console.error('Gemini diagnosis API error:', err);
      return res.status(500).json({
        error: err.message || 'Diagnosis generation error',
        isAi: false
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      timestamp: Date.now()
    });
  });

  // Setup Vite in middleware mode for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VoltCraft Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
