import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    postRent,
    getRent,
    deleteRentData,
} from '../controllers/rent.controller.js';

const router = express.Router();

// Routes for renting items
router.post('/postrent', protectRoute, postRent);
router.get('/getrent', protectRoute, getRent);
router.post('/delete', protectRoute, deleteRentData);
export default router;
