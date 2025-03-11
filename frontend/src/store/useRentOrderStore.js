import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRentOrderStore = create((set) => ({
  orders: [],
  userRentedItems: [],
  isFetchingOrders: false,
  isPostingOrder: false,
  error: null,

  // ✅ Get User's Rent Order History
  getRentHistory: async () => {
    set({ isFetchingOrders: true, error: null });
    try {
      const response = await axiosInstance.get("rentorder/getrent");
      set({ orders: response.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders.");
      set({ error: err.message || "Error fetching orders." });
    } finally {
      set({ isFetchingOrders: false });
    }
  },

  // ✅ Get Sold Rental History (For Owners)
  getSoldRentHistory: async () => {
    set({ isFetchingOrders: true, error: null });
    try {
      const response = await axiosInstance.get("rentorder/getsoldrent");
      set({ orders: response.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch sold orders.");
      set({ error: err.message || "Error fetching sold orders." });
    } finally {
      set({ isFetchingOrders: false });
    }
  },

  // ✅ Get Items User Has Rented
  getUserRentedItems: async () => {
    set({ isFetchingOrders: true, error: null });
    try {
      const response = await axiosInstance.get("rentorder/getuserrenteditems");
      set({ userRentedItems: response.data });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch rented items.");
      set({ error: err.message || "Error fetching rented items." });
    } finally {
      set({ isFetchingOrders: false });
    }
  },

  // ✅ Send Rent Order Data
  sendRentOrder: async ({ itemId, quantity }) => {
    set({ isPostingOrder: true });
    try {
        const response = await axiosInstance.post("rentorder/sendrentorder", { itemId, quantity });

        toast.success("Item rented successfully!");

        // Extract due date from the response
        const { dueDate } = response.data;

        // Update rented items list with the newly rented item
        set((state) => ({
            userRentedItems: [...state.userRentedItems, { itemId, quantity, dueDate }],
        }));
    } catch (err) {
        toast.error(err.response?.data?.message || "Error placing rent order.");
    } finally {
        set({ isPostingOrder: false });
    }
},


  // ✅ Return a Rented Item
  returnRentedItem: async (itemId) => {
    set({ isPostingOrder: true });
    try {
      await axiosInstance.post("rentorder/returnrenteditem", { itemId });
      toast.success("Item returned successfully!");

      // Refresh the user's rented items list
      set((state) => ({
        userRentedItems: state.userRentedItems.filter((item) => item._id !== itemId),
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error returning item.");
    } finally {
      set({ isPostingOrder: false });
    }
  },
}));
