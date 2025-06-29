
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Eye, Edit3, Save } from "lucide-react";

const AdminContent = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [homeContent, setHomeContent] = useState({
    heroTitle: "Transformez vos conversations en livre personnalisé",
    heroSubtitle: "Créez un livre unique à partir de vos échanges WhatsApp et Instagram",
    aboutText: "Notre mission est de donner vie à vos souvenirs numériques..."
  });
  
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Marie Dupont",
      text: "Un service exceptionnel ! Mon livre WhatsApp est magnifique.",
      rating: 5
    },
    {
      id: 2,
      name: "Jean Martin",
      text: "Parfait pour immortaliser nos conversations familiales.",
      rating: 5
    }
  ]);

  const handleSaveContent = async (section: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Contenu mis à jour",
        description: `Le contenu de ${section} a été sauvegardé avec succès.`
      });
    }, 1000);
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: testimonials.length + 1,
      name: "",
      text: "",
      rating: 5
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Gestion du contenu du site</h1>
      
      <Tabs defaultValue="homepage" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="homepage">Page d'accueil</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
          <TabsTrigger value="testimonials">Témoignages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="homepage">
          <Card>
            <CardHeader>
              <CardTitle>Contenu de la page d'accueil</CardTitle>
              <CardDescription>Modifiez les textes principaux de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Titre principal</Label>
                <Input 
                  id="heroTitle"
                  value={homeContent.heroTitle}
                  onChange={(e) => setHomeContent({...homeContent, heroTitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Sous-titre</Label>
                <Textarea 
                  id="heroSubtitle"
                  value={homeContent.heroSubtitle}
                  onChange={(e) => setHomeContent({...homeContent, heroSubtitle: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutText">Texte "À propos"</Label>
                <Textarea 
                  id="aboutText"
                  rows={4}
                  value={homeContent.aboutText}
                  onChange={(e) => setHomeContent({...homeContent, aboutText: e.target.value})}
                />
              </div>
              <div className="flex gap-4">
                <Button onClick={() => handleSaveContent("page d'accueil")} disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>Page "À propos"</CardTitle>
              <CardDescription>Contenu de la page à propos de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Rédigez le contenu de votre page À propos..."
                  rows={10}
                  className="min-h-[200px]"
                />
                <Button onClick={() => handleSaveContent("À propos")}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des médias</CardTitle>
              <CardDescription>Téléchargez et gérez vos images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Button variant="outline">
                      Télécharger une image
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Images récentes</h3>
                  <div className="text-sm text-gray-500">Aucune image téléchargée</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Témoignages clients</CardTitle>
              <CardDescription>Gérez les avis et témoignages affichés sur votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={testimonial.id} className="p-4 border rounded-lg space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nom du client</Label>
                      <Input 
                        value={testimonial.name}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].name = e.target.value;
                          setTestimonials(updated);
                        }}
                        placeholder="Nom du client"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Note (sur 5)</Label>
                      <Input 
                        type="number"
                        min="1"
                        max="5"
                        value={testimonial.rating}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index].rating = parseInt(e.target.value);
                          setTestimonials(updated);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Témoignage</Label>
                    <Textarea 
                      value={testimonial.text}
                      onChange={(e) => {
                        const updated = [...testimonials];
                        updated[index].text = e.target.value;
                        setTestimonials(updated);
                      }}
                      placeholder="Le témoignage du client..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex gap-4">
                <Button onClick={handleAddTestimonial} variant="outline">
                  Ajouter un témoignage
                </Button>
                <Button onClick={() => handleSaveContent("témoignages")}>
                  <Save className="mr-2 h-4 w-4" />
                  Sauvegarder tous
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContent;
