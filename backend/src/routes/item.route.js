import express from 'express';
import {getMarketData,sendMarketData,deleteMarketData,updateMarketData} from '../controllers/item.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/item',protectRoute,getMarketData);
router.get('/getitem',protectRoute,sendMarketData);
router.post('/item/delete',protectRoute,deleteMarketData);
router.post('/item/update',protectRoute,updateMarketData);



export default router;