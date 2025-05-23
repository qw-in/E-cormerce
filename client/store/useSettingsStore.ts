import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";

interface FeatureBanner {
    id: string;
    imageUrl: string;
}

interface FeatureProduct {
    id: string;
    name: string;
    price: string;
    images: string[];
}

interface SettingState {
    banners: FeatureBanner[];
    featureProducts: FeatureProduct[];
    isLoading: boolean;
    error: string | null;
    fetchBanners: () => Promise<void>;
    fetchFeaturedProducts: () => Promise<void>;
    addBanner: (files: File[]) => Promise<boolean>;
    updateFeaturedProduct: (productId: string[]) => Promise<boolean>;
}

export const useSettingStore = create<SettingState>((set) => ({
    banners: [],
    featureProducts: [],
    isLoading: false,
    error: null,
    fetchBanners: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_ROUTES.SETTINGS}/get-banners`,
                {
                    withCredentials: true,
                }
            );
            set({ banners: response.data.banners, isLoading: false });
        } catch (error) {
            console.log(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },
    fetchFeaturedProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_ROUTES.SETTINGS}/get-feature-products`,
                {
                    withCredentials: true,
                }
            );
            set({
                featureProducts: response.data.featureProducts,
                isLoading: false,
            });
        } catch (error) {
            console.log(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },
    addBanner: async (files: File[]) => {
        set({ isLoading: true, error: null });
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        try {
            const response = await axios.post(
                `${API_ROUTES.SETTINGS}/banners`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            set({
                isLoading: false,
            });
            return response.data.success;
        } catch (error) {
            console.log(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },

    updateFeaturedProduct: async (productId: string[]) => {
        set({ isLoading: true, error: null });

        try {
            const response = await axios.post(
                `${API_ROUTES.SETTINGS}/update-feature-products`,
                { productId },
                {
                    withCredentials: true,
                }
            );
            set({
                isLoading: false,
            });
            return response.data.success;
        } catch (error) {
            console.log(error);
            set({ error: "Failed to fetch banners", isLoading: false });
        }
    },
}));
