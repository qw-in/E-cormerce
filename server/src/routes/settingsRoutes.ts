import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";
import {
    addFeatureBanners,
    fetchFeatureBanners,
    getFeaturedProducts,
    updateFeatureProducts,
} from "../controllers/settingsControler";

const router = express.Router();

router.post(
    "/banners",
    authenticateJwt,
    isSuperAdmin,
    upload.array("images", 5),
    addFeatureBanners
);

router.get("/get-banners", authenticateJwt, fetchFeatureBanners);
router.post(
    "/update-feature-products",
    authenticateJwt,
    isSuperAdmin,
    updateFeatureProducts
);
router.get("/get-feature-products", authenticateJwt, getFeaturedProducts);

export default router;
