import { Router } from 'express';
import { signupHandler } from './inbound/signupHandler';

const authRouter = Router();

authRouter.post('/signup', signupHandler);

export { authRouter };