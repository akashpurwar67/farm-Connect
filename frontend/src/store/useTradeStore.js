import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useTradeStore = create((set) => ({
    trades: [],
    isGettingTrades: false,
    isPostingTrade: false,
    isGettingTradeMatch: false,
    
    getTrades: async () => {
        set({ isGettingTrades: true, error: null });
        try {
        const trades = await axiosInstance.get("trade/tradelisted");
        set({ trades: trades.data });
        } catch (err) {
        toast.error(err.response.data.message);
        } finally {
        set({ isGettingTrades: false });
        }
    },
    
    postTrade: async (data) => {
        set({ isPostingTrade: true });
        try {
        await axiosInstance.post("trade/tradepost", data);
        toast.success("Trade posted successfully!");
        } catch (err) {
        toast.error(err.response.data.message);
        } finally {
        set({ isPostingTrade: false });
        }
    },
    findUser: async (userid) => {
        try {
            const user = await axiosInstance.get(`trade/user?userid=${userid}`);
            return user.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    },
    deleteTrade: async (tradeid) => {
        try {
            await axiosInstance.delete(`trade/tradedelete?tradeid=${tradeid}`);
            toast.success("Trade deleted successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        }
    }
}));
    