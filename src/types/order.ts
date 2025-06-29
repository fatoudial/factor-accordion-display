
export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'PAID' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'REFUNDED';

export interface Order {
  id: string;
  orderReference: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt?: Date | string;
  trackingNumber?: string;
  estimatedDeliveryDate?: Date | string;
  bookFormat?: string;
  bookId?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  bookFormat?: string;
  bookCoverType?: string;
  imageUrl?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  fullName?: string;
  address: string;
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface OrdersFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
