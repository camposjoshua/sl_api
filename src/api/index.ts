import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import register from './register';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/register', register);

export default router;
