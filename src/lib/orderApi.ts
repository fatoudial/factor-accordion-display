
import type { Order, OrderStatus, OrdersFilters } from '@/types/order';
import { mockApi, type AdminFilters } from './mockBackend';

// Définir l'API pour les commandes avec mocks améliorés
export const orderApi = {
  // Récupérer toutes les commandes (admin) avec filtres étendus
  getAllOrders: async (token: string, filters?: OrdersFilters & {
    bookFormat?: string;
    paymentMethod?: string;
    dateRange?: { from: Date; to: Date };
  }): Promise<Order[]> => {
    console.log('Fetching orders with filters:', filters);
    
    // Convertir les filtres vers le format du mock backend
    const mockFilters: AdminFilters = {};
    
    if (filters?.status) mockFilters.status = filters.status;
    if (filters?.search) mockFilters.search = filters.search;
    if (filters?.dateFrom && filters?.dateTo) {
      mockFilters.dateRange = { from: filters.dateFrom, to: filters.dateTo };
    }
    if (filters?.dateRange) {
      mockFilters.dateRange = filters.dateRange;
    }
    if (filters?.bookFormat) mockFilters.bookFormat = filters.bookFormat;
    if (filters?.paymentMethod) mockFilters.paymentMethod = filters.paymentMethod;
    
    return await mockApi.orders.getAll(mockFilters);
  },
  
  // Récupérer une commande par ID
  getOrderById: async (token: string, orderId: string): Promise<Order> => {
    const order = await mockApi.orders.getById(orderId);
    if (!order) {
      throw new Error("Commande non trouvée");
    }
    return order;
  },
  
  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (token: string, orderId: string, status: OrderStatus): Promise<Order> => {
    const updatedOrder = await mockApi.orders.updateStatus(orderId, status);
    if (!updatedOrder) {
      throw new Error("Commande non trouvée");
    }
    return updatedOrder;
  },
  
  // Récupérer les commandes d'un utilisateur
  getUserOrders: async (token: string): Promise<Order[]> => {
    // Pour la démo, retourner quelques commandes aléatoires
    const allOrders = await mockApi.orders.getAll();
    return allOrders.slice(0, 3);
  },
  
  // Annuler une commande
  cancelOrder: async (token: string, orderId: string): Promise<Order> => {
    const order = await mockApi.orders.getById(orderId);
    if (!order) {
      throw new Error("Commande non trouvée");
    }
    
    // Vérifier si la commande peut être annulée
    if (!["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(order.status)) {
      throw new Error("Cette commande ne peut plus être annulée");
    }
    
    return await mockApi.orders.updateStatus(orderId, "CANCELLED");
  },

  // Obtenir des statistiques pour l'admin
  getDashboardStats: async (token: string) => {
    return await mockApi.dashboard.getStats();
  }
};

// Pour obtenir un aperçu de livre à partir d'une commande
export const getBookPreview = async (token: string, orderId: string) => {
  // Simulation d'une requête API pour obtenir un aperçu
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `book-${orderId}`,
        title: "Conversation avec Jean",
        coverDesign: {
          style: "modern",
          color: "#1e40af",
          image: "/covers/book-cover-3.png"
        },
        format: "STANDARD",
        createdAt: new Date(),
        pages: [
          { type: "cover", title: "Notre conversation", subtitle: "Souvenirs précieux" },
          { type: "title", title: "Notre conversation", author: "Jean & Marie" },
          { type: "messages", date: "2023-05-01", messages: [
            { text: "Bonjour, comment vas-tu aujourd'hui?", sender: "Jean", timestamp: new Date() },
            { text: "Très bien merci! Et toi?", sender: "Marie", timestamp: new Date() }
          ]},
          // Plus de pages simulées...
        ]
      });
    }, 500);
  });
};
