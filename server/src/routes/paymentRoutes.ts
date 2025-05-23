import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import {
    capturePaypalOrder,
    createFinalOrder,
    createPaypalOrder,
    getAllOrderForAdmin,
    getOrder,
    getOrderByUserId,
    updateOrderStatus,
} from "../controllers/paymentController";

const router = express.Router();

router.use(authenticateJwt);

router.post("/create-paypal-order", createPaypalOrder);
router.post("/capture-paypal-order", capturePaypalOrder);
router.post("/create-final-order", createFinalOrder);
router.get("/get-single-order", getOrder);
router.get("/get-order-by-user-id", getOrderByUserId);
router.get("/get-all-order-for-admin", isSuperAdmin, getAllOrderForAdmin);
router.put("/:orderId/status", isSuperAdmin, updateOrderStatus);

export default router;
