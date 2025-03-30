import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useRentStore = create((set, get) => ({
  allRentItems: [],
  isGettingRent: false,
  isPostingRent: false,
  getRentItems: async () => {
    set({ isGettingRent: true });
    try {
      const { data } = await axiosInstance.get("/rent/getrent");
      set({ allRentItems: data });
    } catch (err) {
      console.error("Error fetching rent items:", err);
      toast.error(err.response?.data?.message || "Failed to fetch rent items");
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
      await get().getRentItems(); // Refresh after posting
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
      await get().getRentItems(); // Refresh list after deletion
    } catch (err) {
      console.error("Error deleting rent item:", err);
      toast.error(err.response?.data?.message || "Failed to delete rental item");
    } finally {
      set({ isPostingRent: false });
    }
  },
}));