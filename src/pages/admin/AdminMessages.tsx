
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Mail, Reply, Archive, Search, Send } from "lucide-react";

const AdminMessages = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Marie Dupont",
      email: "marie.dupont@email.com",
      subject: "Question sur les formats de livre",
      message: "Bonjour, je voudrais savoir quelles sont les différences entre les formats classique et premium ?",
      date: new Date("2024-01-15"),
      status: "nouveau",
      response: ""
    },
    {
      id: 2,
      name: "Jean Martin",
      email: "jean.martin@email.com",
      subject: "Problème avec ma commande",
      message: "Ma commande n°12345 semble bloquée en statut 'en traitement' depuis 5 jours.",
      date: new Date("2024-01-14"),
      status: "répondu",
      response: "Bonjour Jean, votre commande est en cours de finalisation..."
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [responseText, setResponseText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "tous" || message.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendResponse = async () => {
    if (!selectedMessage || !responseText.trim()) return;
    
    const updatedMessages = messages.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, status: "répondu", response: responseText }
        : msg
    );
    
    setMessages(updatedMessages);
    setResponseText("");
    setSelectedMessage(null);
    
    toast({
      title: "Réponse envoyée",
      description: `Votre réponse à ${selectedMessage.name} a été envoyée.`
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      "nouveau": { label: "Nouveau", variant: "default" as const },
      "répondu": { label: "Répondu", variant: "secondary" as const },
      "archivé": { label: "Archivé", variant: "outline" as const }
    };
    
    const config = configs[status as keyof typeof configs] || configs.nouveau;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Support client & Messagerie</h1>
      
      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList>
          <TabsTrigger value="inbox">Boîte de réception</TabsTrigger>
          <TabsTrigger value="templates">Réponses rapides</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox">
          <div className="space-y-6">
            {/* Filtres */}
            <Card>
              <CardHeader>
                <CardTitle>Filtres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher par nom, email ou sujet..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-48">
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="tous">Tous les statuts</option>
                      <option value="nouveau">Nouveau</option>
                      <option value="répondu">Répondu</option>
                      <option value="archivé">Archivé</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des messages */}
            <Card>
              <CardHeader>
                <CardTitle>Messages reçus</CardTitle>
                <CardDescription>
                  {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""} trouvé{filteredMessages.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMessages.map((message) => (
                    <div key={message.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{message.name}</span>
                            {getStatusBadge(message.status)}
                          </div>
                          <div className="text-sm text-gray-600">{message.email}</div>
                          <div className="font-medium mt-1">{message.subject}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {message.date.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">{message.message}</p>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
                            >
                              <Reply className="h-4 w-4 mr-1" />
                              Répondre
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Répondre à {selectedMessage?.name}</DialogTitle>
                              <DialogDescription>
                                Sujet: {selectedMessage?.subject}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium mb-2">Message original:</p>
                                <p className="text-sm">{selectedMessage?.message}</p>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="response">Votre réponse</Label>
                                <Textarea
                                  id="response"
                                  placeholder="Tapez votre réponse..."
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  rows={5}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleSendResponse}>
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer la réponse
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4 mr-1" />
                          Archiver
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Réponses rapides</CardTitle>
              <CardDescription>Créez des modèles de réponses pour gagner du temps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Confirmation de commande</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    "Bonjour, nous confirmons la réception de votre commande. Celle-ci sera traitée dans les plus brefs délais..."
                  </p>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Délai de livraison</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    "Les délais de livraison sont de 7 à 10 jours ouvrés pour les formats classiques..."
                  </p>
                  <Button variant="outline" size="sm">Modifier</Button>
                </div>
                <Button>Ajouter un nouveau modèle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des échanges</CardTitle>
              <CardDescription>Consultez l'historique complet des conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Fonctionnalité en cours de développement
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMessages;
