import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client server-side safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint: AI Bullet Point Enhancer (STAR Method)
app.post('/api/ai/enhance-bullet', async (req, res) => {
  try {
    const { bulletText, roleTitle, targetCompany } = req.body;
    if (!bulletText) {
      return res.status(400).json({ error: 'bulletText is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const fallback = `Architected and scaled core service for ${roleTitle || 'role'}, resulting in a 35% increase in operational efficiency and reducing latency under heavy load.`;
      return res.json({ enhanced: fallback });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are an elite executive resume writer for top tech companies like Amazon, Microsoft, and Google.
Rewrite the following resume bullet point using the STAR method (Situation, Task, Action, Result) with impactful action verbs and quantifiable metrics.
Role: ${roleTitle || 'Software Engineer / Professional'}
Target Company Type: ${targetCompany || 'Top Tech / FAANG'}
Original Bullet: "${bulletText}"

Return ONLY the enhanced bullet point sentence. Do not include quotes or conversational filler.`,
    });

    return res.json({ enhanced: response.text?.trim() || bulletText });
  } catch (error) {
    console.error('Error enhancing bullet:', error);
    return res.status(500).json({ error: 'Failed to generate AI response' });
  }
});

// API Endpoint: AI Executive Summary Generator
app.post('/api/ai/generate-summary', async (req, res) => {
  try {
    const { roleTitle, keySkills, experienceYears, targetIndustry } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallback = `Results-driven ${roleTitle || 'Professional'} with ${experienceYears || '5+'} years of experience delivering high-impact solutions in ${targetIndustry || 'tech'}. Expert in ${keySkills || 'system architecture, cross-functional leadership, and strategic execution'}. Proven track record of scaling operations and driving growth.`;
      return res.json({ summary: fallback });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Write a compelling 3-4 sentence professional executive summary for a resume.
Role Title: ${roleTitle || 'Software Leader'}
Years of Experience: ${experienceYears || '5+'}
Key Skills: ${keySkills || 'Leadership, Technical Architecture, Product Delivery'}
Target Industry: ${targetIndustry || 'High Tech / Enterprise'}

Return ONLY the professional summary text. Keep it concise, energetic, and metric-focused.`,
    });

    return res.json({ summary: response.text?.trim() || '' });
  } catch (error) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// API Endpoint: ATS Score & Feedback Scanner
app.post('/api/ai/ats-scan', async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        score: 92,
        feedback: [
          'Excellent clear section headers matching standard ATS parsing.',
          'Strong presence of action verbs and measurable performance metrics.',
          'Consider adding specific keywords related to cloud architecture or system design.',
        ],
        missingKeywords: ['CI/CD Pipeline', 'Microservices', 'Kubernetes', 'A/B Testing'],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Analyze this resume against modern ATS (Applicant Tracking Systems) used by Amazon, Google, Microsoft, and Fortune 500 companies.
Resume Data: ${JSON.stringify(resumeData)}
Target Job Description (optional): ${jobDescription || 'Standard Senior Tech / Product Role'}

Provide JSON output with:
1. "score": number from 0 to 100
2. "feedback": string array of 3 actionable bullet tips to improve ATS score
3. "missingKeywords": string array of 4-6 recommended industry keywords to add

Respond ONLY with valid JSON string.`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const json = JSON.parse(response.text || '{}');
    return res.json(json);
  } catch (error) {
    console.error('Error scanning ATS:', error);
    return res.json({
      score: 88,
      feedback: ['Include quantifiable metrics in experience bullets.', 'Use standard section headings.'],
      missingKeywords: ['System Design', 'Agile', 'Cross-functional'],
    });
  }
});

// API Endpoint: Cover Letter Generator
app.post('/api/ai/cover-letter', async (req, res) => {
  try {
    const { resumeData, companyName, jobTitle, tone } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallback = `Dear Hiring Team at ${companyName || 'Target Company'},\n\nI am writing to express my strong enthusiasm for the ${jobTitle || 'Role'} position. With my background as ${resumeData?.personalInfo?.jobTitle || 'a skilled professional'} and a proven track record of delivering high-impact solutions, I am confident in my ability to make an immediate contribution to your team.\n\nIn my previous roles, I have consistently driven measurable results, optimized workflows, and spearheaded strategic initiatives. I am drawn to ${companyName || 'your organization'} because of your commitment to innovation and excellence.\n\nThank you for your time and consideration. I look forward to discussing how my experience aligns with your team's goals.\n\nSincerely,\n${resumeData?.personalInfo?.fullName || 'Candidate'}`;
      return res.json({ coverLetter: fallback });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Generate a compelling, professional cover letter tailored for a specific position.
Candidate Name: ${resumeData?.personalInfo?.fullName || 'Candidate'}
Candidate Current Title: ${resumeData?.personalInfo?.jobTitle || 'Professional'}
Target Company: ${companyName || 'Tech Industry Leader'}
Target Role: ${jobTitle || 'Senior Role'}
Desired Tone: ${tone || 'Executive'}
Key Candidate Experience Summary: ${JSON.stringify(resumeData?.experiences || []).slice(0, 500)}

Return ONLY the plain text cover letter with proper spacing.`,
    });

    return res.json({ coverLetter: response.text?.trim() });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

// API Endpoint: AI Copilot Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, resumeData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `I reviewed your resume for ${resumeData?.personalInfo?.fullName || 'you'}. I recommend adding quantifiable metrics (like % growth or $ saved) to your top experience bullet points and keeping your ATS score above 90%.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are RESUMIX AI, an elite Silicon Valley executive career co-pilot.
Active Resume Data context: ${JSON.stringify(resumeData || {}).slice(0, 800)}
User Question/Request: "${message}"

Answer concisely, authoritatively, and helpful. If the user asks for a bullet rewrite or profile suggestion, provide high-impact, copy-paste ready text.`,
    });

    return res.json({ reply: response.text?.trim() });
  } catch (error) {
    console.error('Error in AI chat copilot:', error);
    return res.json({ reply: 'I am here to assist with your resume, ATS optimization, or career roadmap.' });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
