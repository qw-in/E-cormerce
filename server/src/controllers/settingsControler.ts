import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";

export const addFeatureBanners = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            res.status(404).json({
                success: false,
                message: "No files provides",
            });
            return;
        }
        const uploadPromise = files.map((file) =>
            cloudinary.uploader.upload(file.path, {
                folder: "ecommerce-feature-banners",
            })
        );

        const uploadResult = await Promise.all(uploadPromise);
        const banners = await Promise.all(
            uploadResult.map((res) =>
                prisma.featureBanner.create({
                    data: {
                        imageUrl: res.secure_url,
                    },
                })
            )
        );

        files.forEach((file) => fs.unlinkSync(file.path));
        res.status(201).json({
            success: true,
            banners,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add feature banners",
        });
    }
};

export const fetchFeatureBanners = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const banners = await prisma.featureBanner.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.status(200).json({
            success: true,
            banners,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch feature banners",
        });
    }
};

export const updateFeatureProducts = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.body;

        if (!Array.isArray(productId) || productId.length > 8) {
            res.status(400).json({
                success: false,
                message: "Invalid product Id's or too many product",
            });
            return;
        }

        await prisma.product.updateMany({
            data: { isFeatured: false },
        });

        await prisma.product.updateMany({
            where: { id: { in: productId } },
            data: {
                isFeatured: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Updated feature product successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update feature products",
        });
    }
};

export const getFeaturedProducts = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const featureProducts = await prisma.product.findMany({
            where: { isFeatured: true },
        });
        res.status(200).json({
            success: true,
            featureProducts,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get feature products",
        });
    }
};
