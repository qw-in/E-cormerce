import express from "express";
import { authenticateJwt } from "../middleware/authMiddleware";
import {
    createAddress,
    deleteAddress,
    getAddress,
    updateAddress,
} from "../controllers/addressControllers";

const router = express.Router();

router.use(authenticateJwt);

router.post("/add-address", createAddress);
router.get("/get-address", getAddress);
router.delete("/delete-address/:id", deleteAddress);
router.put("/update-address/:id", updateAddress);

export default router;
