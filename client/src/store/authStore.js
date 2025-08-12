import { create } from "zustand";
import { axiosInstance } from "../utils/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const VITE_SOCKET_URI = import.meta.env.MODE === "development" 
? import.meta.env.VITE_SOCKET_URI : "/"; 


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
      setAuthUser: (user) => set({ authUser: user }),

    checkAuth: async() => {
    try {
        const res = await axiosInstance.get("/user/check");
        console.log("checkAuth response:", res.data);
        set({authUser: res.data})
         get().connectSocket();

    } catch (error) {
        console.error("Error in checkAuth", error);
         set({authUser: null})
    }
    finally{
        set({isCheckingAuth: false});
    }
    }
     ,
    signup: async(data) => {
        set({isSigningUp: true});
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({authUser: res.data.newUser});
               get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("Error in signup", error);  
        }
        finally {
            set({isSigningUp: false});
        }
    },
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
   get().connectSocket();
   
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
    logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  updateProfile: async(data) => {
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put("/user/update-profile", data, {withCredentials: true});
    set({ authUser: res.data })

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in updateProfile:", error);
      toast.error(error.response.data.message);
    }
    finally{set({isUpdatingProfile: false})}
  },

  connectSocket: async() => {
      const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
     const socket = io(VITE_SOCKET_URI, {
      query: {
        userId: authUser._id
      }
     });
    socket.connect();

    set({socket: socket});

    socket.on("getOnlineUsers", (userIds) => {
        set({onlineUsers: userIds})
    })

  },
    disconnectSocket: async() => {
         if (get().socket?.connected) get().socket.disconnect();
    }

}))