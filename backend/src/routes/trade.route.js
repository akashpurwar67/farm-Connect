import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js'


import {getTradeMatch,getTrades,postTrade,getUser} from '../controllers/trade.controller.js';

const router = express.Router();

router.get('/tradelisted',protectRoute,getTrades);
router.get('/tradematch',protectRoute,getTradeMatch);
router.post('/tradepost',protectRoute,postTrade);
router.get('/user',protectRoute,getUser);





export default router;


