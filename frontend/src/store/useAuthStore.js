import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: JSON.parse(localStorage.getItem("authUser")) || null, // Load from storage
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
            
            localStorage.setItem("authUser", JSON.stringify(res.data));

            get().connectSocket(); // Reconnect socket
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({ authUser: null });
            localStorage.removeItem("authUser");
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });

            localStorage.setItem("authUser", JSON.stringify(res.data));

            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            localStorage.setItem("authUser", JSON.stringify(res.data));

            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });

            localStorage.removeItem("authUser");

            toast.success("Logged out successfully");
            get().disconnectSocket();
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: { userId: authUser._id },
        });

        socket.connect();
        set({ socket });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null });
        }
    },
}));
