import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import cloudinary from "../config/cloudinary";
import { prisma } from "../server";
import fs from "fs";
import { Prisma } from "@prisma/client";

//create a product
export const createProduct = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            name,
            brand,
            description,
            category,
            gender,
            sizes,
            colors,
            price,
            stock,
        } = req.body;

        const files = req.files as Express.Multer.File[];

        //upload all images to cloudinary
        const uploadPromises = files.map((file) =>
            cloudinary.uploader.upload(file.path, {
                folder: "ecommerce",
            })
        );

        const uploadresults = await Promise.all(uploadPromises);
        const imageUrls = uploadresults.map((result) => result.secure_url);

        const newlyCreatedProduct = await prisma.product.create({
            data: {
                name,
                brand,
                category,
                description,
                gender,
                sizes: sizes.split(","),
                colors: colors.split(","),
                price: parseFloat(price),
                stock: parseInt(stock),
                images: imageUrls,
                soldCount: 0,
                rating: 0,
            },
        });

        //clean the uploaded files
        files.forEach((file) => fs.unlinkSync(file.path));
        res.status(201).json(newlyCreatedProduct);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Some error occured!",
        });
    }
};

// fetch all product(adminside)
export const fetchAllProductForAdmin = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const fetchAllProduct = await prisma.product.findMany();
        res.status(200).json(fetchAllProduct);
    } catch (error) {
        res.status(500).json({ success: false, message: "Some error occured" });
    }
};

//get a single product
export const getProductByID = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            res.status(404).json({
                success: false,
                error: "Product not found",
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: "Some error occured" });
    }
};

//update a product(admin)
export const updateProduct = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            name,
            brand,
            description,
            category,
            gender,
            sizes,
            colors,
            price,
            stock,
            rating,
        } = req.body;
        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                brand,
                category,
                description,
                gender,
                sizes: sizes.split(","),
                colors: colors.split(","),
                price: parseFloat(price),
                stock: parseInt(stock),
                rating: parseFloat(rating),
            },
        });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ success: false, message: "Some error occured" });
    }
};
//delete a product(admin)
export const deleteProduct = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        res.status(200).json({
            success: true,
            message: "Product deleted success",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Some error occured" });
    }
};
//fetch product with filter(client)
export const fetchProductForClient = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const colors = ((req.query.colors as string) || "")
            .split(",")
            .filter(Boolean);
        const limit = parseInt(req.query.limit as string) || 10;
        const categories = ((req.query.categories as string) || "")
            .split(",")
            .filter(Boolean);
        const brands = ((req.query.brands as string) || "")
            .split(",")
            .filter(Boolean);
        const sizes = ((req.query.sizes as string) || "")
            .split(",")
            .filter(Boolean);
        const minPrice = parseFloat(req.query.minPrice as string) || 0;
        const maxPrice =
            parseFloat(req.query.maxPrice as string) || Number.MAX_SAFE_INTEGER;
        const sortBy = (req.query.sortBy as string) || "createdAt";
        const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            AND: [
                categories.length > 0
                    ? {
                          category: {
                              in: categories,
                              mode: "insensitive",
                          },
                      }
                    : {},
                brands.length > 0
                    ? {
                          brand: {
                              in: brands,
                              mode: "insensitive",
                          },
                      }
                    : {},
                sizes.length > 0
                    ? {
                          sizes: {
                              hasSome: sizes,
                          },
                      }
                    : {},
                colors.length > 0
                    ? {
                          colors: {
                              hasSome: colors,
                          },
                      }
                    : {},
                {
                    price: { gte: minPrice, lte: maxPrice },
                },
            ],
        };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
            prisma.product.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            products,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalProducts: total,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fail to fetch product for client",
        });
    }
};
