import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRentStore = create((set, get) => ({
  rentItems: [],
  userRentOrders: [],
  farmerRentOrders: [],
  isGettingRent: false,
  isPostingRent: false,

  // ✅ Fetch all rental items (Marketplace view)
  // ✅ Return a rented item
returnRentItem: async (orderId) => {
    set({ isPostingRent: true });
    try {
        console.log("orderId", orderId);
      await axiosInstance.post("/rent/return-rent-item", { orderId });
      toast.success("Item returned successfully!");
      await get().getUserRentOrders(); // Refresh buyer orders
    } catch (err) {
      console.error("Error returning item:", err);
      toast.error(err.response?.data?.message || "Failed to return item");
    } finally {
      set({ isPostingRent: false });
    }
  },
  
  getRentItems: async () => {
    set({ isGettingRent: true });
    try {
      const { data } = await axiosInstance.get("/rent/getrent");
      set({ rentItems: data });
    } catch (err) {
      console.error("Error fetching rent items:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rent items");
    } finally {
      set({ isGettingRent: false });
    }
  },

  // ✅ Fetch rental items listed by the logged-in user
  getListedRentItems: async () => {
    set({ isGettingRent: true });
    try {
      const { data } = await axiosInstance.get("/rent/getlistedrent");
      set({ rentItems: data });
    } catch (err) {
      console.error("Error fetching listed rent items:", err);
      toast.error(err.response?.data?.message || "Failed to fetch listed rent items");
    } finally {
      set({ isGettingRent: false });
    }
  },

  // ✅ Post a new rental item
  postRentItems: async (data) => {
    set({ isPostingRent: true });
    try {
      await axiosInstance.post("/rent/postrent", data);
      toast.success("Rental item added successfully!");
      await get().getListedRentItems(); // Refresh after posting
    } catch (err) {
      console.error("Error posting rent item:", err);
      toast.error(err.response?.data?.message || "Failed to add rental item");
    } finally {
      set({ isPostingRent: false });
    }
  },

  // ✅ Delete a rental item
  deleteRentData: async (id) => {
    set({ isPostingRent: true });
    try {
      await axiosInstance.post("/rent/delete", { id }); // As per backend route
      toast.success("Rental item deleted successfully");
      await get().getListedRentItems(); // Refresh list after deletion
    } catch (err) {
      console.error("Error deleting rent item:", err);
      toast.error(err.response?.data?.message || "Failed to delete rental item");
    } finally {
      set({ isPostingRent: false });
    }
  },

  // ✅ Rent an item (Buyer requests rental)
  rentItem: async ({ itemId, quantity }) => {
    set({ isPostingRent: true });
    try {
      await axiosInstance.post("/rent/rentitem", { itemId, quantity });
      toast.success("Rent request sent successfully!");
    } catch (err) {
      console.error("Error renting item:", err);
      toast.error(err.response?.data?.message || "Failed to rent item");
    } finally {
      set({ isPostingRent: false });
    }
  },

  // ✅ Accept/Reject Rent Order (Farmer action)
  handleRentRequest: async ({ orderId, action }) => {
    set({ isPostingRent: true });
    try {
      await axiosInstance.post("/rent/handle-rent-request", { orderId, action });
      toast.success(`Rent request ${action}ed successfully!`);
      await get().getFarmerRentOrders(); // Refresh farmer's order list
    } catch (err) {
      console.error(`Error ${action}ing rent order:`, err);
      toast.error(err.response?.data?.message || `Failed to ${action} rent order`);
    } finally {
      set({ isPostingRent: false });
    }
  },

  // ✅ Cancel Rent Order (Buyer action)
  cancelRentOrder: async (orderId) => {
    set({ isPostingRent: true });
    try {
      await axiosInstance.post("/rent/cancel-rent-order", { orderId });
      toast.success("Rent order cancelled successfully!");
      await get().getUserRentOrders(); // Refresh user's rent orders
    } catch (err) {
      console.error("Error canceling rent order:", err);
      toast.error(err.response?.data?.message || "Failed to cancel rent order");
    } finally {
      set({ isPostingRent: false });
    }
  },

  // ✅ Fetch Buyer's Rent Orders
  getUserRentOrders: async () => {
    set({ isGettingRent: true });
    try {
      const { data } = await axiosInstance.get("/rent/get-user-rent-orders");
      set({ userRentOrders: data });
    } catch (err) {
      console.error("Error fetching user rent orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rent orders");
    } finally {
      set({ isGettingRent: false });
    }
  },

  // ✅ Fetch Farmer's Rent Orders
  getFarmerRentOrders: async () => {
    set({ isGettingRent: true });
    try {
      const { data } = await axiosInstance.get("/rent/get-farmer-rent-orders");
      set({ farmerRentOrders: data });
    } catch (err) {
      console.error("Error fetching farmer rent orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rent orders");
    } finally {
      set({ isGettingRent: false });
    }
  },
}));
