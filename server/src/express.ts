// src/types/express.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
  };
}