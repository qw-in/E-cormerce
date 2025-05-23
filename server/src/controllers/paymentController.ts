import axios from "axios";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { NextFunction, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../server";

const PAYMENT_CLIENT_ID =
    "AUWaNg2g7fs4ENySQuqtTyvXk1yI8eWxn-xcYQsnkA3xfYyoS0ulYW5-SGtTt2fPkmiu8yzBCvapR6uo";
const PAYMENT_CLIENT_SECRET =
    "EHdVMZYlosHit8GtcRV74C3kTE-Qjyvl-VD1jnrZdvHWqNXS0dVpPRttqtR4LdBBWVRARnMPAOCN92P6";

const getPaypalAccessToken = async () => {
    const response = await axios.post(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token",
        "grant_type=client_credentials",
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${PAYMENT_CLIENT_ID}:${PAYMENT_CLIENT_SECRET}`
                ).toString("base64")}`,
            },
        }
    );
    return response.data.access_token;
};

export const createPaypalOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { items, total } = req.body;
        const accessToken = await getPaypalAccessToken();

        const paypalItems = items.map((item: any) => ({
            name: item.name,
            description: item.description || "",
            sku: item.id,
            unit_amount: {
                currency_code: "USD",
                value: item.price.toFixed(2),
            },
            quantity: item.quantity.toString(),
            category: "PHYSICAL_GOODS",
        }));

        const itemTotal = paypalItems.reduce(
            (sum: any, item: any) =>
                sum +
                parseFloat(item.unit_amount.value) * parseInt(item.quantity),
            0
        );

        const response = await axios.post(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: total.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: itemTotal.toFixed(2),
                                },
                            },
                        },
                        items: paypalItems,
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                    "PayPal-Request-ID": uuidv4(),
                },
            }
        );

        res.status(200).json(response.data);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Unexpected error occured!",
        });
    }
};

export const capturePaypalOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { orderId } = req.body;
        const accessToken = await getPaypalAccessToken();

        const response = await axios.post(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};

export const createFinalOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { items, addressId, couponId, total, paymentId } = req.body;
        const userId = req.user?.userId;
        if (!userId) {
            res.status(500).json({
                success: false,
                message: "Authenticated user",
            });
            return;
        }
        //Start our transaction
        const order = await prisma.$transaction(async (prisma) => {
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    addressId,
                    couponId,
                    total,
                    paymentMethod: "CREDIT_CARD",
                    paymentStatus: "COMPLETED",
                    paymentId,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            productName: item.productName,
                            productCategory: item.productCategory,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                            price: item.price,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            for (const item of items) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        soldCount: { increment: item.quantity },
                    },
                });
            }

            await prisma.cartItem.deleteMany({
                where: {
                    cart: { userId },
                },
            });
            if (couponId) {
                await prisma.coupon.update({
                    where: { id: couponId },
                    data: { usageCount: { increment: 1 } },
                });
            }
            return newOrder;
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};

export const getOrder = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { orderId } = req.params;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authenticated user",
            });
            return;
        }

        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: true,
                address: true,
                coupon: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "fetch order successfully",
            order: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};

export const updateOrderStatus = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { orderId } = req.params;
        const { status } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authenticated user",
            });
            return;
        }

        await prisma.order.update({
            where: {
                id: orderId,
            },
            data: {
                status: status,
            },
        });

        res.status(200).json({
            success: false,
            message: "updated order successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};

export const getAllOrderForAdmin = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                address: true,
                items: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "fetch user successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};
export const getOrderByUserId = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Authenticated user",
            });
            return;
        }
        const orders = await prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                items: true,
                address: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({
            success: true,
            message: "fetch user successfully",
            orders,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unexpected error ouccured",
        });
    }
};
