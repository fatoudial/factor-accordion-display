import { supabase } from "@/integrations/supabase/client";

// Types pour les services
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  format: string;
  pages: number;
  cover_style: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  order_reference: string;
  status: string;
  book_format: string;
  book_title?: string;
  total_amount: number;
  payment_method?: string;
  payment_provider?: string;
  transaction_id?: string;
  shipping_address: any;
  book_data?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: string;
  provider_transaction_id?: string;
  amount: number;
  status: string;
  provider_response?: any;
  phone_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  order_id?: string;
  created_at: string;
}

// Service des produits
export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }
};

// Service des commandes
export const orderService = {
  async createOrder(orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping_address: any;
    book_data?: any;
    book_title?: string;
    book_format: string;
  }): Promise<Order> {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: orderData
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error || 'Failed to create order');
    
    return data.order;
  },

  async getUserOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
};

// Service des paiements
export const paymentService = {
  async processPayment(paymentData: {
    order_id: string;
    payment_method: 'orange_money' | 'wave' | 'credit_card';
    phone_number?: string;
    card_details?: {
      number: string;
      expiry: string;
      cvc: string;
      name: string;
    };
  }): Promise<{
    success: boolean;
    transaction_id?: string;
    message: string;
    payment_id: string;
  }> {
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: paymentData
    });

    if (error) throw error;
    return data;
  },

  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Service des notifications
export const notificationService = {
  async getUserNotifications(): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  async markAllAsRead(): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) throw error;
  }
};

// Service admin
export const adminService = {
  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAllPayments(): Promise<Payment[]> {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getOrderStats(): Promise<{
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    total_revenue: number;
  }> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_amount');

    if (error) throw error;

    const stats = {
      total_orders: orders?.length || 0,
      pending_orders: orders?.filter(o => ['PENDING_PAYMENT', 'PAID', 'PROCESSING'].includes(o.status)).length || 0,
      completed_orders: orders?.filter(o => ['DELIVERED'].includes(o.status)).length || 0,
      total_revenue: orders?.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0
    };

    return stats;
  }
};

// Utilitaires
export const formatPrice = (priceInCents: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(priceInCents / 100);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'PENDING_PAYMENT': 'text-yellow-600',
    'PAID': 'text-blue-600',
    'PROCESSING': 'text-orange-600',
    'SHIPPED': 'text-purple-600',
    'DELIVERED': 'text-green-600',
    'CANCELLED': 'text-red-600',
    'REFUNDED': 'text-gray-600'
  };
  return colors[status] || 'text-gray-600';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'PENDING_PAYMENT': 'En attente de paiement',
    'PAID': 'Payé',
    'PROCESSING': 'En préparation',
    'SHIPPED': 'Expédié',
    'DELIVERED': 'Livré',
    'CANCELLED': 'Annulé',
    'REFUNDED': 'Remboursé'
  };
  return labels[status] || status;
};