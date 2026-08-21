import { Request, Response } from 'express';
import { research } from '../services/research.service';

export const askResearch = (req: Request, res: Response): void => {
  const { query } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query required' });
    return;
  }
  const answer = research(query);
  res.json({ answer });
};