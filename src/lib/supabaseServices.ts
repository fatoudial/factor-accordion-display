import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Types from Supabase
type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];
type Product = Database['public']['Tables']['products']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

// Formatage des prix
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString()} FCFA`;
};

// Service de gestion des commandes
export const orderService = {
  // Créer une nouvelle commande
  async createOrder(orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping_address: any;
    book_format: string;
    book_title: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const total_amount = orderData.items.reduce(
      (sum, item) => sum + (item.unit_price * item.quantity), 
      0
    );

    // Créer la commande principale
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount,
        status: 'PENDING_PAYMENT',
        shipping_address: orderData.shipping_address,
        book_format: orderData.book_format,
        book_title: orderData.book_title,
        book_data: { items: orderData.items },
        order_reference: `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Créer les éléments de commande
    for (const item of orderData.items) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity
        });

      if (itemError) console.error('Erreur lors de la création des éléments:', itemError);
    }

    return order;
  },

  // Récupérer toutes les commandes (pour admin)
  async getAllOrders(filters?: {
    status?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookFormat?: string;
    paymentMethod?: string;
  }) {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          product_id
        ),
        payments (
          id,
          payment_method,
          status,
          amount
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`order_reference.ilike.%${filters.search}%`);
    }

    if (filters?.dateFrom) {
      query = query.gte('created_at', filters.dateFrom.toISOString());
    }

    if (filters?.dateTo) {
      query = query.lte('created_at', filters.dateTo.toISOString());
    }

    if (filters?.bookFormat) {
      query = query.eq('book_format', filters.bookFormat);
    }

    if (filters?.paymentMethod) {
      query = query.eq('payment_method', filters.paymentMethod);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Transform data to match Order interface
    return (data || []).map(order => ({
      id: order.id,
      orderReference: order.order_reference,
      userId: order.user_id,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id || '',
        name: order.book_title || 'Livre Souvenir',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        bookFormat: order.book_format
      })) || [],
      totalAmount: order.total_amount,
      status: order.status as any,
      shippingAddress: order.shipping_address as any,
      paymentMethod: order.payment_method || '',
      paymentId: order.payments?.[0]?.id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      bookFormat: order.book_format,
      bookId: order.id
    }));
  },

  // Récupérer les commandes d'un utilisateur
  async getUserOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          product_id
        ),
        payments (
          id,
          payment_method,
          status,
          amount
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform data to match Order interface
    return (data || []).map(order => ({
      id: order.id,
      orderReference: order.order_reference,
      userId: order.user_id,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id || '',
        name: order.book_title || 'Livre Souvenir',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        bookFormat: order.book_format
      })) || [],
      totalAmount: order.total_amount,
      status: order.status as any,
      shippingAddress: order.shipping_address as any,
      paymentMethod: order.payment_method || '',
      paymentId: order.payments?.[0]?.id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      bookFormat: order.book_format,
      bookId: order.id
    }));
  },

  // Récupérer une commande par ID
  async getOrderById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          product_id
        ),
        payments (
          id,
          payment_method,
          status,
          amount,
          provider_response
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Transform data to match Order interface
    return {
      id: data.id,
      orderReference: data.order_reference,
      userId: data.user_id,
      items: data.order_items?.map((item: any) => ({
        id: item.id,
        productId: item.product_id || '',
        name: data.book_title || 'Livre Souvenir',
        quantity: item.quantity,
        unitPrice: item.unit_price,
        bookFormat: data.book_format
      })) || [],
      totalAmount: data.total_amount,
      status: data.status as any,
      shippingAddress: data.shipping_address as any,
      paymentMethod: data.payment_method || '',
      paymentId: data.payments?.[0]?.id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      bookFormat: data.book_format,
      bookId: data.id
    };
  },

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtenir les statistiques pour le dashboard admin
  async getDashboardStats() {
    // Total des commandes
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Commandes en attente
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['PENDING_PAYMENT', 'PAID', 'PROCESSING']);

    // Commandes livrées
    const { count: completedOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'DELIVERED');

    // Revenus totaux
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'DELIVERED');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    return {
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      totalRevenue
    };
  }
};

// Service de gestion des paiements
export const paymentService = {
  // Traiter un paiement
  async processPayment(paymentData: {
    order_id: string;
    payment_method: string;
    phone_number?: string;
    card_details?: any;
  }) {
    try {
      // Simuler le traitement du paiement (remplacer par vraie intégration)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Créer l'enregistrement de paiement
      const { data: order } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('id', paymentData.order_id)
        .single();

      if (!order) throw new Error('Commande non trouvée');

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: paymentData.order_id,
          amount: order.total_amount,
          payment_method: paymentData.payment_method.toUpperCase(),
          phone_number: paymentData.phone_number,
          status: 'COMPLETED'
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Mettre à jour le statut de la commande
      await supabase
        .from('orders')
        .update({ 
          status: 'PAID',
          payment_method: paymentData.payment_method.toUpperCase()
        })
        .eq('id', paymentData.order_id);

      return { success: true, payment };
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      return { 
        success: false, 
        message: error.message || 'Erreur lors du traitement du paiement' 
      };
    }
  },

  // Récupérer l'historique des paiements
  async getPaymentHistory() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders!inner (
          user_id,
          order_reference,
          book_title
        )
      `)
      .eq('orders.user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};

// Service de gestion des produits
export const productService = {
  // Récupérer tous les produits actifs
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Créer un nouveau produit (admin uniquement)
  async createProduct(productData: {
    title: string;
    description?: string;
    price: number;
    format: string;
    pages?: number;
    cover_style?: string;
  }) {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Service de notifications
export const notificationService = {
  // Créer une notification
  async createNotification(data: {
    user_id: string;
    title: string;
    message: string;
    type: string;
    order_id?: string;
  }) {
    const { error } = await supabase
      .from('notifications')
      .insert(data);

    if (error) throw error;
  },

  // Récupérer les notifications d'un utilisateur
  async getUserNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non authentifié');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }
};