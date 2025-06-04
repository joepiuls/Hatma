import { create } from "zustand";
import { toast } from "sonner";
import { api } from "../axios";
import useAuthStore from "./useAuthStore";

export const useProfileStore = create((set, get) => ({
  addresses:[],
  isModalOpen: false,
  editingAddress: null,

 fetchProfile: async () => {
  try {
    const res = await api.get("/user/profile");
    const user = res.data.user;

    set({ addresses: user.address});
    useAuthStore.getState()?.setUser(user);
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    toast.error("Could not fetch profile details");
  }
},


  openModal: (address = null) => {
    const transformed = address
      ? {
          ...address,
          country: address.country
            ? { label: address.country, value: address.countryCode, phoneCode: address.phoneCode }
            : null,
          state: address.state ? { label: address.state, value: address.stateCode } : null,
        }
      : null;

    set({ editingAddress: transformed, isModalOpen: true });
  },

  closeModal: () => {
    set({ editingAddress: null, isModalOpen: false });
  },

  setDefaultAddress: async (id) => {
    const updatedAddresses = get().addresses.map((addr) =>
      addr._id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
    );

    try {
      const res = await api.put("/user/update-profile", {
        address: updatedAddresses,
      });
      set({ addresses: res.data.user.address });
      useAuthStore.getState().setUser(res.data.user);
      toast.success("Default address updated");
    } catch {
      toast.error("Failed to update default address");
    }
  },

  submitAddress: async (data) => {
  const { editingAddress, addresses } = get();
  let updatedAddresses;  

  // Conform to backend schema
const formattedData = {
    street: data.streetAddress,
    city: data.city,
    state: data.state?.label || data.state || "",
    postalCode: data.zipCode,
    country: data.country?.label || data.country || "",
    isDefault: editingAddress?.isDefault || addresses.length === 0,
    phoneCode:data.phoneCode,
    phone: data.phoneNumber,
  };

  if (editingAddress) {
  updatedAddresses = addresses.map((addr) =>
    addr._id === editingAddress._id ? { ...addr, ...formattedData } : addr
  );
} else {
  const newAddress = {
    ...formattedData,
    };
    updatedAddresses = [...addresses, newAddress];
  }

try {
    const res = await api.put("/user/update-profile", {
      address: updatedAddresses,
      phoneNumber: `${data.phoneCode + data.phoneNumber}`,
    });
    set({ addresses: res.data.user.address });
    useAuthStore.getState().setUser(res.data.user);
    toast.success("Address and phone number saved");
  } catch {
    toast.error("Failed to save address and phone number");
  }

  get().closeModal();
},

  deleteAddress: async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this address?");
    if (!confirmDelete) return;

    const updatedAddresses = get().addresses.filter((addr) => addr._id !== id);

    try {
      const res = await api.put("/user/update-profile", {
        address: updatedAddresses,
      });
      set({ addresses: res.data.user.address });
      useAuthStore.getState().setUser(res.data.user);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  },
}));
