import express from 'express';
import { loginUser } from '../controllers/auth-controller.js';

const loginRouter = express.Router();

// POST request to log in
loginRouter.post('/', loginUser);

export default loginRouter;
