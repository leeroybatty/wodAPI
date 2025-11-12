import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { requireEnvVar } from '@server/services/logger/envcheck';

const USER_AUTH_TOKEN_NAME = requireEnvVar('USER_AUTH_TOKEN_NAME');
const SECRET_KEY_JWT = requireEnvVar('SECRET_KEY_JWT');

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[USER_AUTH_TOKEN_NAME];
  
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY_JWT) as JwtPayload;
    if (typeof decoded.sub === 'string') {
      req.userId = decoded.sub;
    } else {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};