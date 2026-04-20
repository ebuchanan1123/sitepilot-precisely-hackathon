import { Router, type Request, type Response } from 'express';
import { runAnalysis } from '../services/llm.js';
import { isValidString } from '../utils/helpers.js';

const router = Router();

async function handleAnalysis(req: Request, res: Response) {
  const { prompt, question, context, locationContext, candidates, alternatives } = req.body;
  const normalizedPrompt = isValidString(prompt) ? prompt.trim() : isValidString(question) ? question.trim() : '';
  const normalizedContext = isValidString(context) ? context.trim() : isValidString(locationContext) ? locationContext.trim() : '';
  const normalizedCandidates = Array.isArray(candidates)
    ? candidates.filter(isValidString).map((item) => item.trim())
    : Array.isArray(alternatives)
      ? alternatives.filter(isValidString).map((item) => item.trim())
    : [];

  if (!normalizedPrompt || normalizedCandidates.length === 0) {
    return res.status(400).json({
      message: 'A prompt and at least one valid candidate item are required.',
    });
  }

  try {
    const result = await runAnalysis(normalizedPrompt, normalizedContext, normalizedCandidates);
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to run analysis.' });
  }
}

router.post('/analyze', handleAnalysis);
router.post('/evaluate', handleAnalysis);

export default router;
