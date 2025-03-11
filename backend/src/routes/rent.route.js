import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    postRent,
    getRent,
    getListedRent,
    deleteRentData,
    rentItem,
    handleRentRequest,
    cancelRentOrder,
    getUserRentOrders,
    getFarmerRentOrders,
    returnRentItem
} from '../controllers/rent.controller.js';

const router = express.Router();

// Routes for renting items
router.post('/postrent', protectRoute, postRent);
router.get('/getrent', protectRoute, getRent);
router.get('/getlistedrent', protectRoute, getListedRent);
router.post('/delete', protectRoute, deleteRentData);
router.post('/rentitem', protectRoute, rentItem);
router.post('/handle-rent-request', protectRoute, handleRentRequest);
router.post('/cancel-rent-order', protectRoute, cancelRentOrder);
router.get('/get-user-rent-orders', protectRoute, getUserRentOrders);
router.get('/get-farmer-rent-orders', protectRoute, getFarmerRentOrders);
router.post('/return-rent-item', protectRoute, returnRentItem);
export default router;
