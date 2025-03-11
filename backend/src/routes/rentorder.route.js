import express from 'express';
import {postRentOrder,getSoldRentOrder,getRentOrder} from '../controllers/rentorder.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/sendrentorder',protectRoute,postRentOrder);
router.get('/getrent',protectRoute,getRentOrder);
router.get('/getsoldrent',protectRoute,getSoldRentOrder);


export default router;