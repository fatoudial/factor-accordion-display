
import { toast } from "@/components/ui/use-toast";
import type { ProcessedMessage } from "@/utils/fileProcessing";
import type { BookDesign } from "@/types/book";

// Constante pour l'URL de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Fonction utilitaire pour gérer les erreurs des requêtes
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  toast({
    title: "Erreur de communication avec le serveur",
    description: error.message || "Veuillez réessayer ultérieurement",
    variant: "destructive",
  });
  throw error;
};

// Interface pour le statut du livre
export interface BookStatus {
  id: number;
  status: string;
  progress: number;
  message?: string;
}

// API pour les messages
export const messagesApi = {
  // Extraction de messages à partir d'un fichier
  extractMessages: async (file: File, platform: string): Promise<ProcessedMessage[]> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("platform", platform);
    
    try {
      const response = await fetch(`${API_BASE_URL}/messages/extract`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Filtrage des messages par date
  filterMessagesByDate: async (conversationId: number, startDate: Date, endDate: Date): Promise<ProcessedMessage[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/messages/filter?conversationId=${conversationId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        { method: "GET" }
      );
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};

// API pour les livres
export const booksApi = {
  // Création d'un nouveau livre
  createBook: async (bookDesign: BookDesign) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookDesign),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Récupération du statut d'un livre
  getBookStatus: async (bookId: number): Promise<BookStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/status`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },
  
  // Annulation de la création d'un livre
  cancelBook: async (bookId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}/cancel`, {
        method: "PUT",
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error: any) {
      return handleApiError(error);
    }
  },
};
