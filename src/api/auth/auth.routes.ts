import { Router } from 'express';
import Controller from './auth.controller'
import authenticate from '../../middleware/internal-auth';
import * as validation from './auth.validation'

const router = Router();
const controller = new Controller();

router.post('/register', authenticate, validation.register, controller.register);
router.post('/login', authenticate, validation.login, controller.login);

export default router;