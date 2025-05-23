import {
    createProduct,
    fetchAllProductForAdmin,
    getProductByID,
    updateProduct,
    deleteProduct,
    fetchProductForClient,
} from "../controllers/productController";
import express from "express";
import { authenticateJwt, isSuperAdmin } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

router.post(
    "/create-new-product",
    authenticateJwt,
    isSuperAdmin,
    upload.array("images", 5),
    createProduct
);
router.get(
    "/fetch-admin-product",
    authenticateJwt,
    isSuperAdmin,
    fetchAllProductForAdmin
);
router.get("/fetch-client-products", authenticateJwt, fetchProductForClient);
router.get("/:id", authenticateJwt, getProductByID);
router.put("/:id", authenticateJwt, isSuperAdmin, updateProduct);
router.delete("/:id", authenticateJwt, isSuperAdmin, deleteProduct);

export default router;
