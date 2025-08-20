import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, FileText, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BookDownloadManagerProps {
  bookId?: string;
}

const BookDownloadManager: React.FC<BookDownloadManagerProps> = ({ bookId }) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [bookStatus, setBookStatus] = useState<'processing' | 'completed' | 'error'>('completed');

  const handleDownloadBook = async () => {
    if (!bookId) {
      // Récupérer les informations du livre depuis sessionStorage
      const generatedBookData = sessionStorage.getItem('generatedBook');
      if (!generatedBookData) {
        toast({
          title: "Erreur",
          description: "Aucun livre généré trouvé. Veuillez d'abord générer un livre.",
          variant: "destructive",
        });
        return;
      }

      const bookData = JSON.parse(generatedBookData);
      await downloadBook(bookData.bookId);
    } else {
      await downloadBook(bookId);
    }
  };

  const downloadBook = async (id: string) => {
    setIsDownloading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`http://localhost:8080/api/books/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }

      // Créer un lien de téléchargement
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `livre_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Téléchargement réussi",
        description: "Votre livre a été téléchargé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Impossible de télécharger le livre.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = () => {
    switch (bookStatus) {
      case 'processing':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'completed':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Livre généré
          </span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Téléchargez votre livre au format PDF avec les conversations formatées en bulles de chat
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleDownloadBook} 
            disabled={isDownloading || bookStatus === 'processing'}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Téléchargement...' : 'Télécharger le PDF'}
          </Button>
          
          <Button 
            variant="outline" 
            disabled={bookStatus === 'processing'}
          >
            <Eye className="w-4 h-4 mr-2" />
            Prévisualiser
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>✅ Messages formatés en bulles de chat WhatsApp</p>
          <p>✅ Images intégrées dans le PDF</p>
          <p>✅ Vidéos remplacées par des liens cliquables</p>
          <p>✅ Dates et heures préservées</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookDownloadManager;