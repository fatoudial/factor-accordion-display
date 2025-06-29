
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Edit, Save, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface BookData {
  id: string;
  title: string;
  orderId: string;
  customerName: string;
  status: 'draft' | 'review' | 'approved' | 'completed';
  pageCount: number;
  format: string;
  createdAt: string;
  lastModified: string;
}

interface BookCreationManagerProps {
  bookId: string;
}

const BookCreationManager: React.FC<BookCreationManagerProps> = ({ bookId }) => {
  const { toast } = useToast();
  const [bookData, setBookData] = useState<BookData>({
    id: bookId,
    title: "Conversations avec Marie",
    orderId: "CMD-2024-001",
    customerName: "Jean Dupont",
    status: 'review',
    pageCount: 127,
    format: "Classique",
    createdAt: "2024-01-15",
    lastModified: "2024-01-20"
  });

  const [editMode, setEditMode] = useState(false);
  const [tempTitle, setTempTitle] = useState(bookData.title);

  const handleSaveTitle = () => {
    setBookData(prev => ({ ...prev, title: tempTitle }));
    setEditMode(false);
    toast({
      title: "Titre modifié",
      description: "Le titre du livre a été mis à jour avec succès.",
    });
  };

  const handleDownloadBook = () => {
    toast({
      title: "Téléchargement démarré",
      description: "Le livre est en cours de téléchargement...",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "outline" as const },
      review: { label: "En révision", variant: "secondary" as const },
      approved: { label: "Approuvé", variant: "default" as const },
      completed: { label: "Terminé", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestion du livre
            {getStatusBadge(bookData.status)}
          </CardTitle>
          <CardDescription>
            Commande {bookData.orderId} - {bookData.customerName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Informations</TabsTrigger>
              <TabsTrigger value="edit">Édition</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Titre du livre</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {editMode ? (
                      <>
                        <Input
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleSaveTitle}>
                          <Save className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 p-2 bg-gray-50 rounded">{bookData.title}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Format</Label>
                  <div className="p-2 bg-gray-50 rounded mt-1">{bookData.format}</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Nombre de pages</Label>
                  <div className="p-2 bg-gray-50 rounded mt-1">{bookData.pageCount} pages</div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Dernière modification</Label>
                  <div className="p-2 bg-gray-50 rounded mt-1">{bookData.lastModified}</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="book-title">Titre du livre</Label>
                  <Input id="book-title" value={bookData.title} />
                </div>
                
                <div>
                  <Label htmlFor="book-description">Description</Label>
                  <Textarea 
                    id="book-description" 
                    placeholder="Description du livre..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder les modifications
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                  <Button onClick={handleDownloadBook} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le livre après vérification
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="actions" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Téléchargement</CardTitle>
                    <CardDescription>
                      Télécharger le livre après vérification
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleDownloadBook} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le livre (PDF)
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statut de production</CardTitle>
                    <CardDescription>
                      Modifier le statut du livre
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Marquer comme en révision
                    </Button>
                    <Button variant="outline" className="w-full">
                      Approuver pour impression
                    </Button>
                    <Button className="w-full">
                      Marquer comme terminé
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCreationManager;
