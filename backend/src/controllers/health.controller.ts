import { Request, Response } from 'express';

export class HealthController {
  public static async getHealth(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json({ status: 'ok' });
  }
}

