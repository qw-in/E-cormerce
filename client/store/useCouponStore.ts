import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";

export interface Coupon {
    id: string;
    code: string;
    discountPercent: number;
    startDate: string;
    endDate: string;
    usageLimit: number;
    usageCount: number;
}

interface CouponStore {
    couponList: Coupon[];
    isLoading: boolean;
    error: string | null;
    fetchAllCoupon: () => Promise<void>;
    createCoupon: (
        coupon: Omit<Coupon, "id" | "usageCount">
    ) => Promise<Coupon | null>;
    deteleCoupon: (id: string) => Promise<boolean>;
}

const useCouponStore = create<CouponStore>((set, get) => ({
    couponList: [],
    isLoading: false,
    error: null,

    fetchAllCoupon: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_ROUTES.COUPON}/fetch-all-coupon`,
                {
                    withCredentials: true,
                }
            );
            set({
                couponList: response.data.couponList,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({ isLoading: false, error: "Failed to fetch coupon list" });
        }
    },

    createCoupon: async (coupon) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_ROUTES.COUPON}/create-coupon`,
                coupon,
                {
                    withCredentials: true,
                }
            );
            set({ isLoading: false });
            return response.data.coupon;
        } catch (error) {
            set({ isLoading: false, error: "Failed to create coupon" });
            return null;
        }
    },

    deteleCoupon: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(`${API_ROUTES.COUPON}/${id}`, {
                withCredentials: true,
            });
            set({ isLoading: true });
            return response.data.success;
        } catch (error) {
            set({ isLoading: false, error: "Failed to create coupon" });
            return null;
        }
    },
}));

export default useCouponStore;
