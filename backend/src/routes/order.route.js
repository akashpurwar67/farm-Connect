import express from 'express';
import {postOrder,getOrder,getSoldOrder} from '../controllers/order.controller.js';
import {protectRoute} from '../middleware/auth.middleware.js'

const router = express.Router();

router.post('/postorder',protectRoute,postOrder);
router.get('/getorder',protectRoute,getOrder);
router.get('/getsoldorder',protectRoute,getSoldOrder);

export default router;