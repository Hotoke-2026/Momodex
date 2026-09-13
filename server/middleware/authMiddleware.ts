import { auth } from 'express-oauth2-jwt-bearer';

export const checkJwt = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV === 'test') {
    // In test environment without tokens, simulate unauthorized or mock it out
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  return auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
})(req, res, next);
};