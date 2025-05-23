import { Router } from "express";
import {
    createCoupon,
    deleteCoupon,
    fetchAllCoupon,
} from "../controllers/couponController";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateJwt);

router.get("/fetch-all-coupon", fetchAllCoupon);
router.post("/create-coupon", isSuperAdmin, createCoupon);
router.delete("/:id", isSuperAdmin, deleteCoupon);

export default router;
