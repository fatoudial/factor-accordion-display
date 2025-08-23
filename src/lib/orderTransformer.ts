import type { Order } from '@/types/order';
import type { Database } from '@/integrations/supabase/types';

type SupabaseOrder = Database['public']['Tables']['orders']['Row'] & {
  order_items?: Array<Database['public']['Tables']['order_items']['Row']>;
  payments?: Array<Database['public']['Tables']['payments']['Row']>;
};

export const transformSupabaseOrderToOrder = (supabaseOrder: SupabaseOrder): Order => {
  return {
    id: supabaseOrder.id,
    orderReference: supabaseOrder.order_reference,
    userId: supabaseOrder.user_id,
    items: supabaseOrder.order_items?.map((item) => ({
      id: item.id,
      productId: item.product_id || '',
      name: supabaseOrder.book_title || 'Livre Souvenir',
      quantity: item.quantity,
      unitPrice: item.unit_price,
      bookFormat: supabaseOrder.book_format
    })) || [],
    totalAmount: supabaseOrder.total_amount,
    status: supabaseOrder.status as any,
    shippingAddress: supabaseOrder.shipping_address as any,
    paymentMethod: supabaseOrder.payment_method || '',
    paymentId: supabaseOrder.payments?.[0]?.id,
    createdAt: supabaseOrder.created_at,
    updatedAt: supabaseOrder.updated_at,
    bookFormat: supabaseOrder.book_format,
    bookId: supabaseOrder.id
  };
};

export const transformSupabaseOrdersToOrders = (supabaseOrders: SupabaseOrder[]): Order[] => {
  return supabaseOrders.map(transformSupabaseOrderToOrder);
};