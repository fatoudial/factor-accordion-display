
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Save, Eye, Edit2, Layout } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface BookPreviewEditorProps {
  orderId: string;
  initialFormat?: string;
  bookId?: string;
}

const BookPreviewEditor = ({ orderId, initialFormat = 'STANDARD', bookId }: BookPreviewEditorProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [isEditing, setIsEditing] = useState(false);
  const [bookData, setBookData] = useState({
    title: "Livre Souvenir",
    coverText: "Nos conversations préférées",
    coverColor: "#4A00E0",
    textColor: "#FFFFFF",
    format: initialFormat,
    pageCount: 56
  });

  // Formats de livre disponibles
  const bookFormats = [
    { id: "STANDARD", label: "Standard (15 x 21 cm)" },
    { id: "LARGE", label: "Grand Format (21 x 29.7 cm)" },
    { id: "POCKET", label: "Format Poche (10.5 x 17.5 cm)" },
    { id: "SQUARE", label: "Format Carré (21 x 21 cm)" },
    { id: "EBOOK", label: "eBook (Format numérique)" }
  ];

  // Fonction pour simuler la sauvegarde des modifications
  const handleSave = () => {
    // Ici, vous implémenteriez l'appel API pour sauvegarder les changements
    toast({
      title: "Modifications enregistrées",
      description: `Les modifications du livre pour la commande ${orderId} ont été enregistrées.`
    });
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Aperçu du livre</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="mr-1 h-4 w-4" /> : <Edit2 className="mr-1 h-4 w-4" />}
            {isEditing ? "Terminer" : "Modifier"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="preview">
              <Eye className="mr-1 h-4 w-4" /> Aperçu
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={!isEditing}>
              <Layout className="mr-1 h-4 w-4" /> Paramètres
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-4">
            <div className={`relative rounded-md overflow-hidden shadow-lg ${
              bookData.format === 'SQUARE' ? 'aspect-square' : 
              bookData.format === 'POCKET' ? 'aspect-[10.5/17.5]' :
              bookData.format === 'LARGE' ? 'aspect-[21/29.7]' : 'aspect-[15/21]'
            }`}
            style={{ backgroundColor: bookData.coverColor }}>
              <AspectRatio ratio={bookData.format === 'SQUARE' ? 1 : bookData.format === 'POCKET' ? 10.5/17.5 : bookData.format === 'LARGE' ? 21/29.7 : 15/21}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                  <h3 className="text-xl font-bold mb-2" style={{ color: bookData.textColor }}>
                    {bookData.title}
                  </h3>
                  <p className="text-sm" style={{ color: bookData.textColor }}>
                    {bookData.coverText}
                  </p>
                </div>
              </AspectRatio>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-gray-600">
                  {bookFormats.find(f => f.id === bookData.format)?.label || bookData.format}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Nombre de pages</p>
                <p className="text-sm text-gray-600">{bookData.pageCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">ID du livre</p>
                <p className="text-sm text-gray-600">{bookId || "Non assigné"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">ID de commande</p>
                <p className="text-sm text-gray-600">{orderId}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre du livre</label>
                <Input 
                  value={bookData.title} 
                  onChange={(e) => setBookData({...bookData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select 
                  value={bookData.format} 
                  onValueChange={(value) => setBookData({...bookData, format: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un format" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookFormats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>{format.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Texte de couverture</label>
                <Textarea 
                  value={bookData.coverText} 
                  onChange={(e) => setBookData({...bookData, coverText: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre de pages</label>
                <Input 
                  type="number" 
                  value={bookData.pageCount} 
                  onChange={(e) => setBookData({...bookData, pageCount: parseInt(e.target.value) || 0})}
                  min={20}
                  max={200}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur de couverture</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={bookData.coverColor} 
                    onChange={(e) => setBookData({...bookData, coverColor: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={bookData.coverColor} 
                    onChange={(e) => setBookData({...bookData, coverColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Couleur du texte</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    value={bookData.textColor} 
                    onChange={(e) => setBookData({...bookData, textColor: e.target.value})}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={bookData.textColor} 
                    onChange={(e) => setBookData({...bookData, textColor: e.target.value})}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" /> Enregistrer les modifications
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookPreviewEditor;
