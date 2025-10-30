import { Router } from 'express';
import { signupHandler } from './inbound/signupHandler';
import { loginHandler } from './inbound/loginHandler';
import { logoutHandler } from './inbound/logoutHandler';
import { requestPasswordResetHandler } from './inbound/requestPasswordResetHandler';
import { resetPasswordHandler } from './inbound/resetPasswordHandler';

const authRouter = Router();

authRouter.post('/signup', signupHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/password', requestPasswordResetHandler);
authRouter.put('/password', resetPasswordHandler)

export { authRouter };