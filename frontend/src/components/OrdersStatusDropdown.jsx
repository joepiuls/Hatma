import React from 'react';
import { useOverviewStore } from '../store/useOverviewStore';
import { PAYMENT_OPTIONS, DELIVERY_OPTIONS } from '../store/useOverviewStore';

export const OrderPaymentDropdown = ({ order }) => {
  const { updatePaymentStatus } = useOverviewStore();
  
  if (!order) return <div className="text-sm text-gray-400">Loading...</div>;
  
  const handleChange = (e) => {
    updatePaymentStatus(order.id, { paymentStatus: e.target.value });
  };

  return (
    <div className="flex flex-col gap-1 min-w-[120px]">
      <select
        value={order.paymentStatus || order.payment || PAYMENT_OPTIONS[0]}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
      >
        {PAYMENT_OPTIONS.map(status => (
          <option key={status} value={status}>
            {status.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export const OrderDeliveryDropdown = ({ order }) => {
  const { updateDeliveryStatus } = useOverviewStore();
  
  if (!order) return <div className="text-sm text-gray-400">Loading...</div>;
  
  const handleChange = (e) => {
    updateDeliveryStatus(order.id, { deliveryStatus: e.target.value });
  };

  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <select
        value={order.deliveryStatus || order.delivery || DELIVERY_OPTIONS[0]}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm"
      >
        {DELIVERY_OPTIONS.map(status => (
          <option key={status} value={status}>
            {status.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};