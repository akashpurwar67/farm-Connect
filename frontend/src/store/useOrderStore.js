import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orderHistory: [],
  isGettingOrder: false,
  isSendingOrder: false,
  isGettingRent: false,

  getOrderHistory: async () => {
    set({ isGettingOrder: true, error: null });
    try {
      const response = await axiosInstance.get("order/getorder");
      set({ orderHistory: response.data });
    } catch (err) {
      set({ error: err.message || "Failed to fetch orders." });
    } finally {
      set({ isGettingOrder: false });
    }
  },
  getSoldOrderHistory: async () => {
    set({ isGettingOrder: true, error: null });
    try {
      const response = await axiosInstance.get("order/getsoldorder");
      set({ orderHistory: response.data });
    } catch (err) {
      set({ error: err.message || "Failed to fetch orders." });
    } finally {
      set({ isGettingOrder: false });
    }
  },
  sendOrderData: async (data) => {
    set({ isSendingOrder: true });
    try {
      await axiosInstance.post("order/postorder", data);
      toast.success("Order sent successfully");
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isSendingOrder: false }); 
    }
  },

  cancelOrder: async (orderId) => {
    try {
      await axiosInstance.post(`order/cancel/${orderId}`);
      set((state) => ({
        orderHistory: state.orderHistory.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        ),
      }));
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      await axiosInstance.post(`order/update/${orderId}`, { status });
      set((state) => ({
        orderHistory: state.orderHistory.map((order) =>
          order._id === orderId ? { ...order, status } : order
        ),
      }));
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  },
}));
