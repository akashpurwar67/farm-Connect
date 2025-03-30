import express from 'express';
import {rentItem,getUserRentOrders,getFarmerRentOrders,updateRentOrder} from '../controllers/rentorder.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/sendrentorder',protectRoute,rentItem);
router.get('/getrent',protectRoute,getUserRentOrders);
router.get('/getsoldrent',protectRoute,getFarmerRentOrders);
router.post('/updaterentorder',protectRoute,updateRentOrder);


export default router;