import { supabase } from '@/integrations/supabase/client';

export const adminService = {
  // Statistiques du tableau de bord
  getDashboardStats: async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total_amount, created_at');

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
    const pendingOrders = orders?.filter(order => order.status === 'PENDING_PAYMENT').length || 0;
    const completedOrders = orders?.filter(order => order.status === 'DELIVERED').length || 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    };
  },

  // Récupérer toutes les commandes pour l'admin
  getAllOrders: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*),
        payments(*),
        profiles!orders_user_id_fkey(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (orderId: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const getStatusLabel = (status: string): string => {
  const statusLabels: Record<string, string> = {
    'PENDING_PAYMENT': 'En attente de paiement',
    'PAID': 'Payé',
    'PROCESSING': 'En préparation',
    'SHIPPED': 'Expédié',
    'DELIVERED': 'Livré',
    'CANCELLED': 'Annulé',
    'REFUNDED': 'Remboursé'
  };
  return statusLabels[status] || status;
};