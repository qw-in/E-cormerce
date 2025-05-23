import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createCoupon = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { code, discountPercent, startDate, endDate, usageLimit } =
            req.body;

        const newlyCreatedCoupon = await prisma.coupon.create({
            data: {
                code,
                discountPercent: parseInt(discountPercent),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                usageLimit: parseInt(usageLimit),
                usageCount: 0,
            },
        });

        res.status(200).json({
            success: true,
            message: "Created coupon successfully",
            coupon: newlyCreatedCoupon,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            scuccess: false,
            message: "Failed to create coupon",
        });
    }
};

export const fetchAllCoupon = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const fetchAllCouponList = await prisma.coupon.findMany({
            orderBy: {
                createdAt: "asc",
            },
        });
        res.status(200).json({
            success: true,
            message: "Fetch coupon successfully",
            couponList: fetchAllCouponList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            scuccess: false,
            message: "Failed to fetch coupon",
        });
    }
};

export const deleteCoupon = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {
        const { id } = req.params;
        await prisma.coupon.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Coupon deteled successfully",
            id: id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            scuccess: false,
            message: "Failed to delete coupon",
        });
    }
};
