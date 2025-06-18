import { PaystackButton } from 'react-paystack';
import { useCartStore } from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../axios';
import { useState } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { trackEvent } from '../utils/trackEvent';

const PaystackCheckoutButton = ({ additionalInfo = "" }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cartItems, getCartTotal, checkout } = useCartStore();
  const { setOrder } = useOrderStore();

  const { totalPrice } = getCartTotal();

  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  const email = user?.email || '';
  const amount = totalPrice * 100;

  const componentProps = {
    email,
    amount,
    metadata: {
      name: user?.name,
      phone: user?.phoneNumber,
    },
    publicKey,
    text: 'Pay Now',
    onSuccess: async (reference) => {
      if (loading) return;
      setLoading(true);

      try {
        const order = await checkout({
          items: cartItems,
          totalAmount: totalPrice,
          paymentMethod: 'paystack',
          transactionId: reference?.reference,
          additionalInfo,
        });

        if (!order?._id) throw new Error("Invalid order");

        setOrder(order);
        trackEvent('sale', {orderId: order._id});
        // Send receipt
        try {
          await api.post('/user/receipt', {
            to: user.email,
            orderId: order._id,
            name: user.name,
            items: cartItems,
            totalAmount: totalPrice,
          });
        } catch (emailErr) {
          console.error("Email receipt failed", emailErr);
        }
        navigate(`/order/${order._id}`);
      } catch (error) {
        toast.error("Checkout failed after payment");
      } finally {
        setLoading(false);
      }
    },
    onClose: () => toast.warning("Payment cancelled"),
  };

  return (
    <PaystackButton {...componentProps} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg" />
  );
};

export default PaystackCheckoutButton;
