import { Router, Request, Response } from 'express';
import { signupHandler } from './inbound/signupHandler';
import { loginHandler } from './inbound/loginHandler';
import { logoutHandler } from './inbound/logoutHandler';
import { requestPasswordResetHandler } from './inbound/requestPasswordResetHandler';
import { resetPasswordHandler } from './inbound/resetPasswordHandler';
import { requireAuth } from '@server/routes/infrastructure/middleware/requireAuth';

const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/password', requestPasswordResetHandler);
authRouter.put('/password', resetPasswordHandler);
authRouter.get('/check',  requireAuth, (req: Request, res: Response) => {
 res.json({ 
    userId: req.userId,
    authenticated: true
  });
});

export { authRouter };