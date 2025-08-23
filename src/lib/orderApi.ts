
import { orderService } from './supabaseServices';

// API pour les commandes utilisant Supabase
export const orderApi = {
  // Récupérer toutes les commandes (admin) avec filtres
  getAllOrders: async (token: string, filters?: {
    status?: string;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
    bookFormat?: string;
    paymentMethod?: string;
  }) => {
    console.log('Fetching orders with filters:', filters);
    return await orderService.getAllOrders(filters);
  },
  
  // Récupérer une commande par ID
  getOrderById: async (token: string, orderId: string) => {
    return await orderService.getOrderById(orderId);
  },
  
  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (token: string, orderId: string, status: string) => {
    return await orderService.updateOrderStatus(orderId, status);
  },
  
  // Récupérer les commandes d'un utilisateur
  getUserOrders: async (token: string) => {
    return await orderService.getUserOrders();
  },
  
  // Annuler une commande
  cancelOrder: async (token: string, orderId: string) => {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      throw new Error("Commande non trouvée");
    }
    
    // Vérifier si la commande peut être annulée
    if (!["PENDING_PAYMENT", "PAID", "PROCESSING"].includes(order.status)) {
      throw new Error("Cette commande ne peut plus être annulée");
    }
    
    return await orderService.updateOrderStatus(orderId, "CANCELLED");
  },

  // Obtenir des statistiques pour l'admin
  getDashboardStats: async (token: string) => {
    return await orderService.getDashboardStats();
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
