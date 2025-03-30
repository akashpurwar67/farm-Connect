import express from 'express';
import {postOrder,getOrder,getSoldOrder,updateOrderStatus,cancelOrder} from '../controllers/order.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/postorder',protectRoute,postOrder);
router.get('/getorder',protectRoute,getOrder);
router.get('/getsoldorder',protectRoute,getSoldOrder);
router.post('/update/:orderId',protectRoute,updateOrderStatus);
router.post('/cancel/:orderId',protectRoute,cancelOrder);
export default router;