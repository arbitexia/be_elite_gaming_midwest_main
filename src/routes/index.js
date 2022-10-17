import { Router } from 'express';
import webRouter from './web';
import apiRouter from './api';

const router = Router();

router.use('/', webRouter);
router.use('/api', apiRouter);

export default router;
