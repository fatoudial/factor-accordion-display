
import type { OrderStatus } from '@/types/order';

export const orderStatusConfig: Record<OrderStatus, {
  label: string;
  className: string;
}> = {
  PENDING_PAYMENT: {
    label: 'En attente de paiement',
    className: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  PAID: {
    label: 'Payé',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  PROCESSING: {
    label: 'En traitement',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  SHIPPED: {
    label: 'Expédié',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  DELIVERED: {
    label: 'Livré',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  CANCELLED: {
    label: 'Annulé',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  REFUNDED: {
    label: 'Remboursé',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }
};

export const formatOrderStatus = (status: OrderStatus): string => {
  return orderStatusConfig[status]?.label || status;
};
