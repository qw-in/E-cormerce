import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { prisma } from "../server";

export const addToCart = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { productId, quantity, size, color } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }

        const cart = await prisma.cart.upsert({
            where: { userId },
            create: { userId },
            update: {},
        });

        const cartItem = await prisma.cartItem.upsert({
            where: {
                cartId_productId_size_color: {
                    cartId: cart.id,
                    productId,
                    size: size || null,
                    color: color || null,
                },
            },
            update: {
                quantity: { increment: quantity },
            },
            create: {
                cartId: cart.id,
                productId,
                quantity,
                size,
                color,
            },
        });

        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                name: true,
                price: true,
                images: true,
            },
        });

        const responseItem = {
            id: cartItem.id,
            productId: cartItem.productId,
            name: product?.name,
            price: product?.price,
            image: product?.images[0],
            color: cartItem.color,
            size: cartItem.size,
            quantity: cartItem.quantity,
        };
        res.status(201).json({
            success: true,
            data: responseItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

export const getCart = async (
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
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: true,
            },
        });

        if (!cart) {
            res.status(200).json({
                success: false,
                message: "No item found in cart",
                data: [],
            });
            return;
        }

        const cartItemWithProducts = await Promise.all(
            cart?.items.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        name: true,
                        price: true,
                        images: true,
                    },
                });
                return {
                    id: item.id,
                    productId: item.productId,
                    name: product?.name,
                    price: product?.price,
                    image: product?.images[0],
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                };
            })
        );
        res.status(200).json({
            success: true,
            message: "Cart fetch successfully",
            data: cartItemWithProducts,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
        });
    }
};

export const removeFromCart = async (
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

        await prisma.cartItem.delete({
            where: {
                id,
                cart: { userId },
            },
        });

        res.status(200).json({
            success: true,
            message: "Item was move from cart",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove from cart",
        });
    }
};

export const updateCartItemQuantity = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const { quantity } = req.body;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: "Unauthenticated user",
            });
            return;
        }
        const updateItem = await prisma.cartItem.update({
            where: {
                id,
                cart: { userId },
            },
            data: { quantity },
        });

        const product = await prisma.product.findUnique({
            where: {
                id: updateItem.id,
            },
            select: {
                name: true,
                price: true,
                images: true,
            },
        });

        const responseItem = {
            id: updateItem.id,
            productId: updateItem.productId,
            name: product?.name,
            price: product?.price,
            image: product?.images[0],
            color: updateItem.color,
            size: updateItem.size,
            quantity: updateItem.quantity,
        };

        res.status(200).json({
            success: true,
            data: responseItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update cart item quantity",
        });
    }
};

export const clearEntireCart = async (
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
        await prisma.cartItem.deleteMany({
            where: {
                cart: { userId },
            },
        });
        res.status(200).json({
            success: true,
            message: "Item was move from cart",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to clear entire cart",
        });
    }
};
