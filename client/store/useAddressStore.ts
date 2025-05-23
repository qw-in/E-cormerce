import axios from "axios";
import { create } from "zustand";
import { API_ROUTES } from "../utils/api";

export interface Address {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
    isDefault: boolean;
}

interface AddressStore {
    addresses: Address[];
    isLoading: boolean;
    error: string | null;
    fetchAddress: () => Promise<void>;
    createAddress: (address: Omit<Address, "id">) => Promise<Address | null>;
    deleteAddress: (id: string) => Promise<boolean>;
    updateAddress: (
        id: string,
        address: Partial<Address>
    ) => Promise<Address | null>;
}

export const useAddressStore = create<AddressStore>((set, get) => ({
    addresses: [],
    error: null,
    isLoading: false,
    fetchAddress: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(
                `${API_ROUTES.ADDRESS}/get-address`,
                { withCredentials: true }
            );
            set({ addresses: response.data.address, isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: "failed to fetch cart" });
        }
    },

    createAddress: async (address) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(
                `${API_ROUTES.ADDRESS}/add-address`,
                address,
                { withCredentials: true }
            );
            const newAddress = response.data.address;
            set((state) => ({
                addresses: [newAddress, ...state.addresses],
                isLoading: false,
            }));
            return newAddress;
        } catch (error) {
            set({ isLoading: false, error: "failed to create cart" });
        }
    },

    updateAddress: async (id, address) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(
                `${API_ROUTES.ADDRESS}/update-address/${id}`,
                address,
                { withCredentials: true }
            );
            const updateAddress = response.data.address;
            set((state) => ({
                addresses: state.addresses.map((address) =>
                    address.id === id ? updateAddress : address
                ),
                isLoading: false,
            }));
            return updateAddress;
        } catch (error) {
            set({ isLoading: false, error: "failed to fetch cart" });
        }
    },

    deleteAddress: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`${API_ROUTES.ADDRESS}/delete-address/${id}`, {
                withCredentials: true,
            });
            set((state) => ({
                addresses: state.addresses.filter(
                    (address) => address.id !== id
                ),
            }));
            return true;
        } catch (error) {
            set({ isLoading: false, error: "failed to fetch cart" });
            return false;
        }
    },
}));
