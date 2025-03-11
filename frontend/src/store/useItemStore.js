import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useItemStore = create((set) => ({
    marketData: [],
    isGettingMarketData: false,
    isSendingMarketData: false,
    isUpdatingQunatity: false,
    getMarketData: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const query = new URLSearchParams(filters).toString(); // Convert filters to query string
            const res = await axiosInstance.get(`market/getitem?${query}`);
            set({ marketData: res.data });
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to fetch data.");
        } finally {
            set({ isLoading: false });
        }
    },

    getListedMarketData: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await axiosInstance.get(`market/getlisteditem?${query}`);
            set({ marketData: res.data });
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to fetch data.");
        } finally {
            set({ isLoading: false });
        }
    },
    
    sendMarketData: async (data) => {
        set({ isSendingMarketData: true });
        try {
        await axiosInstance.post("market/item",data);
        toast.success("Market data sent successfully");
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isSendingMarketData: false });
        }
    },
    deleteMarketData: async (id) => {
        set({ isSendingMarketData: true });
        try {
        await axiosInstance.post("market/item/delete",{id});
        toast.success("Market data deleted successfully");
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isSendingMarketData: false });
        }
    },
    updateQuantity: async (data) => {
        const authUser = useAuthStore.getState().authUser;
        set({ isUpdatingQunatity: true });
        try {
        await axiosInstance.post("market/item/update",data);
            if(authUser.usertype === "farmer"){
                toast.success("Market data updated successfully");
            }
        } catch (error) {
        toast.error(error.response.data.message);
        } finally {
        set({ isUpdatingQunatity: false });
        }
    }
}));