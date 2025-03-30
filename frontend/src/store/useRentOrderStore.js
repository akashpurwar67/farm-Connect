import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRentOrderStore = create((set) => ({
  orders: [],
  isFetchingOrders: false,
  isPostingOrder: false,
  error: null,

  // ✅ Fetch all rent orders
  getUserRentOrders: async () => {
    set({ isFetchingOrders: true });
    try {
      const { data } = await axiosInstance.get("/rentorder/getrent");
      set({ orders: data });
    } catch (err) {
      console.error("Error fetching rent orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rent orders");
    } finally {
      set({ isFetchingOrders: false });
    }
  },

  // ✅ Post a rent order
  rentItem: async (order) => {
    set({ isPostingOrder: true });
    try {
      await axiosInstance.post("/rentorder/sendrentorder", order);
      toast.success("Rent order placed successfully!");
    } catch (err) {
      console.error("Error posting rent order:", err);
      toast.error(err.response?.data?.message || "Failed to post rent order");
    } finally {
      set({ isPostingOrder: false });
    }
  },

  // ✅ Update a rent order
  updateRentOrder: async (orderId, status) => {
    set({ isPostingOrder: true });
    try {
      await axiosInstance.post("/rentorder/updaterentorder", {orderId, status});
      toast.success("Rent order updated successfully!");
    } catch (err) {
      console.error("Error updating rent order:", err);
      toast.error(err.response?.data?.message || "Failed to update rent order");
    } finally {
      set({ isPostingOrder: false });
    }
  },
}));

  