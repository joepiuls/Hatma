import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../axios";
import { toast } from "sonner";
import {handleOpenPdf} from '../utils/handleDownloadReciept';

const OrderPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/user/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order");
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Order Confirmation</h1>
      <p className="text-gray-600 mb-6">Order ID: <span className="font-mono">{order._id}</span></p>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Customer Info</h2>
        <p><strong>Name:</strong> {order.user.name}</p>
        <p><strong>Phone:</strong> {order.phoneNumber}</p>
        <p><strong>Address:</strong> {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.country}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Order Items</h2>
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between border-b py-2">
            <span>{item.name} x{item.quantity}</span>
            <span className="font-semibold">NGN {(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>Total Paid</span>
          <span>NGN {order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        A receipt has been sent to your email. Thanks for shopping with Hatma!
      </p>
      <button
        onClick={()=>handleOpenPdf(id)}
        className="inline-block mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-medium"
        >
        Download Receipt PDF
    </button>
    </div>
  );
};

export default OrderPage;
