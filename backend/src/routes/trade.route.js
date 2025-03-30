import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js'


import {getTrades,postTrade,getUser,deleteTrade} from '../controllers/trade.controller.js';

const router = express.Router();

router.get('/tradelisted',protectRoute,getTrades);
router.post('/tradepost',protectRoute,postTrade);
router.get('/user',protectRoute,getUser);
router.delete('/tradedelete',protectRoute,deleteTrade);





export default router;


