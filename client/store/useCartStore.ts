import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";
import debounce from "lodash/debounce";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    color: string;
    size: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    isLoading: boolean;
    error: string | null;
    fetchCart: () => Promise<void>;
    addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
    removeFromCart: (id: string) => Promise<void>;
    upDateCartItemQuantity: (id: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => {
    const debounceUpdateCartItemQuantity = debounce(
        async (id: string, quantity: number) => {
            try {
                await axios.put(
                    `${API_ROUTES.CART}/update/${id}`,
                    { quantity },
                    {
                        withCredentials: true,
                    }
                );
            } catch (error) {
                set({ error: "failed to update cart quantity" });
            }
        }
    );

    return {
        items: [],
        isLoading: false,
        error: null,
        fetchCart: async () => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.get(
                    `${API_ROUTES.CART}/fetch-cart`,
                    {
                        withCredentials: true,
                    }
                );

                set({ items: response.data.data, isLoading: false });
            } catch (error) {
                set({ isLoading: false, error: "failed to fetch cart" });
            }
        },

        addToCart: async (item) => {
            set({ isLoading: true, error: null });
            try {
                const response = await axios.post(
                    `${API_ROUTES.CART}/add-to-cart`,
                    item,
                    {
                        withCredentials: true,
                    }
                );
                set((state) => ({
                    items: [...state.items, response.data.data],
                    isLoading: false,
                }));
            } catch (error) {
                set({ isLoading: false, error: "failed to fetch cart" });
            }
        },

        removeFromCart: async (id) => {
            set({ isLoading: true, error: null });
            try {
                await axios.delete(`${API_ROUTES.CART}/remove/${id}`, {
                    withCredentials: true,
                });

                set((state) => ({
                    items: state.items.filter((item) => item.id !== id),
                    isLoading: false,
                }));
            } catch (error) {
                set({ isLoading: false, error: "failed to delete from cart" });
            }
        },

        upDateCartItemQuantity: async (id, quantity) => {
            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, quantity } : item
                ),
            }));
            debounceUpdateCartItemQuantity(id, quantity);
        },

        clearCart: async () => {
            set({ isLoading: true, error: null });
            try {
                await axios.post(
                    `${API_ROUTES.CART}/clear-cart`,
                    {},
                    {
                        withCredentials: true,
                    }
                );
                set({ items: [], isLoading: false });
            } catch (error) {
                set({ isLoading: false, error: "failed to clear cart" });
            }
        },
    };
});
