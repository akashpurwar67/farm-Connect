import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useTradeStore = create((set) => ({
    trades: [],
    matches: [],
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
    
    getTradeMatch: async (needs) => {
        set({ isGettingTradeMatch: true, error: null });
        try {
            const tradeMatch = await axiosInstance.get(`trade/tradematch?needs=${encodeURIComponent(needs)}`);
            set({ matches: tradeMatch.data });
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong!");
        } finally {
            set({ isGettingTradeMatch: false });
        }
    },
}));
    