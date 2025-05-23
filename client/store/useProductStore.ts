import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";

export interface Product {
    id: string;
    name: string;
    brand: string;
    description: string;
    category: string;
    gender: string;
    sizes: string[];
    colors: string[];
    price: number;
    stock: number;
    soldCount: number;
    rating: number;
    images: string[];
}

interface ProductState {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    fetchAllProductForAdmin: () => Promise<void>;
    createProduct: (productData: FormData) => Promise<Product>;
    updateProduct: (id: string, productData: FormData) => Promise<Product>;
    deleteProduct: (id: string) => Promise<boolean>;
    getProductById: (id: string) => Promise<Product>;
    fetchProductForClient: (params: {
        page?: number;
        limit?: number;
        categories?: string[];
        sizes?: string[];
        colors?: string[];
        brands?: string[];
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }) => Promise<void>;
    setCurrentPage: (page: number) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    isLoading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    fetchAllProductForAdmin: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_ROUTES.PRODUCT}/fetch-admin-product`,
                {
                    withCredentials: true,
                }
            );
            set({ products: response.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: "Failed to fetch a product" });
        }
    },

    createProduct: async (productData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_ROUTES.PRODUCT}/create-new-product`,
                productData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: "Failed to create a product" });
        }
    },

    updateProduct: async (id: string, productData: FormData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(
                `${API_ROUTES.PRODUCT}/${id}`,
                productData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: "Failed to update product" });
        }
    },

    deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const respose = await axios.delete(`${API_ROUTES.PRODUCT}/${id}`, {
                withCredentials: true,
            });
            set({ isLoading: false });
            return respose.data.success;
        } catch (error) {
            set({ isLoading: false, error: "Failed to delete a product" });
        }
    },

    getProductById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_ROUTES.PRODUCT}/${id}`, {
                withCredentials: true,
            });
            set({ isLoading: false });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: "Failed to get product" });
        }
    },

    fetchProductForClient: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const queryParams = {
                ...params,
                categories: params.categories?.join(","),
                sizes: params.sizes?.join(","),
                colors: params.colors?.join(","),
                brands: params.brands?.join(","),
            };
            const response = await axios.get(
                `${API_ROUTES.PRODUCT}/fetch-client-products`,
                {
                    params: queryParams,
                    withCredentials: true,
                }
            );
            set({
                products: response.data.products,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalProducts: response.data.totalProducts,
                isLoading: false,
            });
        } catch (error) {
            set({ error: "Fail to fetch products", isLoading: false });
        }
    },
    setCurrentPage: (page: number) => set({ currentPage: page }),
}));
