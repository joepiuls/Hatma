import { toast } from "sonner";
import { api } from "../axios";


export const handleOpenPdf = async (order) => {
  try {
    const token = localStorage.getItem('token');
    const res = await api.get(`/user/orders/${order}/receipt`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
    window.open(blobUrl, '_blank');
  } catch (err) {
    toast.error("Couldn't open receipt PDF");
    console.error(err);
  }
};
