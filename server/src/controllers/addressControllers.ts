import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const createAddress = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }
        const { name, address, city, country, postalCode, phone, isDefault } =
            req.body;

        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: {
                    isDefault: false,
                },
            });
        }

        const newlyCreatedAddress = await prisma.address.create({
            data: {
                userId,
                name,
                address,
                city,
                country,
                postalCode,
                phone,
                isDefault: isDefault || false,
            },
        });

        res.status(201).json({
            success: true,
            address: newlyCreatedAddress,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error occured",
        });
    }
};
export const getAddress = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }

        const fetchAllAddress = await prisma.address.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        res.status(201).json({
            success: true,
            address: fetchAllAddress,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "fail to fetch address",
        });
    }
};
export const updateAddress = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }

        const existingAddress = await prisma.address.findFirst({
            where: { userId, id },
        });

        if (!existingAddress) {
            res.status(404).json({
                success: false,
                message: "address not found",
            });
        }

        const { name, address, city, country, postalCode, phone, isDefault } =
            req.body;
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId },
                data: {
                    isDefault: false,
                },
            });
        }
        const newlyUpdateAddress = await prisma.address.update({
            where: { id },
            data: {
                name,
                address,
                city,
                country,
                postalCode,
                phone,
                isDefault: isDefault || false,
            },
        });

        res.status(201).json({
            success: true,
            address: newlyUpdateAddress,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "updated address failed",
        });
    }
};

export const deleteAddress = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }

        const existingAddress = await prisma.address.findFirst({
            where: { userId, id },
        });

        if (!existingAddress) {
            res.status(404).json({
                success: false,
                message: "address not found",
            });
        }

        await prisma.address.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: "address deleted sccessfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "delete address failed",
        });
    }
};
