
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // État pour les paramètres du site
  const [siteSettings, setSiteSettings] = useState({
    siteName: "Mon site de livres",
    siteDescription: "Créez et commandez vos livres à partir de vos conversations WhatsApp et Instagram",
    enableRegistration: true,
    enablePayments: true,
    maintenanceMode: false
  });
  
  // État pour les paramètres de paiement
  const [paymentSettings, setPaymentSettings] = useState({
    enableMobileMoney: true,
    enableCreditCard: false,
    minOrderAmount: 10000,
    currency: "XOF",
    defaultProvider: "orange_money"
  });
  
  // État pour les paramètres d'email
  const [emailSettings, setEmailSettings] = useState({
    fromEmail: "noreply@example.com",
    adminEmail: "admin@example.com",
    enableOrderConfirmation: true,
    enablePaymentConfirmation: true,
    emailSignature: "L'équipe de Mon site de livres"
  });

  const handleSiteSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simuler une mise à jour
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres du site ont été mis à jour avec succès."
      });
    }, 1000);
  };
  
  const handlePaymentSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simuler une mise à jour
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de paiement ont été mis à jour avec succès."
      });
    }, 1000);
  };
  
  const handleEmailSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simuler une mise à jour
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres d'email ont été mis à jour avec succès."
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Paramètres d'administration</h1>
      
      <Tabs defaultValue="site" className="space-y-8">
        <TabsList className="w-full border-b mb-6">
          <TabsTrigger value="site" className="flex-1 md:flex-none">Paramètres du site</TabsTrigger>
          <TabsTrigger value="payment" className="flex-1 md:flex-none">Paiements</TabsTrigger>
          <TabsTrigger value="email" className="flex-1 md:flex-none">Emails</TabsTrigger>
          <TabsTrigger value="security" className="flex-1 md:flex-none">Sécurité</TabsTrigger>
        </TabsList>
        
        {/* Paramètres du site */}
        <TabsContent value="site">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les paramètres généraux du site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input 
                      id="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Description</Label>
                    <Input 
                      id="siteDescription"
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableRegistration">Activer l'inscription</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre aux nouveaux utilisateurs de s'inscrire
                      </p>
                    </div>
                    <Switch 
                      id="enableRegistration"
                      checked={siteSettings.enableRegistration}
                      onCheckedChange={(checked) => setSiteSettings({...siteSettings, enableRegistration: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePayments">Activer les paiements</Label>
                      <p className="text-sm text-muted-foreground">
                        Permettre le traitement des paiements
                      </p>
                    </div>
                    <Switch 
                      id="enablePayments"
                      checked={siteSettings.enablePayments}
                      onCheckedChange={(checked) => setSiteSettings({...siteSettings, enablePayments: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Mode maintenance</Label>
                      <p className="text-sm text-muted-foreground">
                        Mettre le site en mode maintenance
                      </p>
                    </div>
                    <Switch 
                      id="maintenanceMode"
                      checked={siteSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenanceMode: checked})}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Paramètres de paiement */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de paiement</CardTitle>
              <CardDescription>
                Configurez les options de paiement disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePaymentSettingsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableMobileMoney">Mobile Money</Label>
                      <p className="text-sm text-muted-foreground">
                        Accepter les paiements par Mobile Money
                      </p>
                    </div>
                    <Switch 
                      id="enableMobileMoney"
                      checked={paymentSettings.enableMobileMoney}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableMobileMoney: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableCreditCard">Carte de crédit</Label>
                      <p className="text-sm text-muted-foreground">
                        Accepter les paiements par carte de crédit
                      </p>
                    </div>
                    <Switch 
                      id="enableCreditCard"
                      checked={paymentSettings.enableCreditCard}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, enableCreditCard: checked})}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Montant minimum de commande (XOF)</Label>
                    <Input 
                      id="minOrderAmount"
                      type="number"
                      value={paymentSettings.minOrderAmount}
                      onChange={(e) => setPaymentSettings({...paymentSettings, minOrderAmount: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Input 
                      id="currency"
                      value={paymentSettings.currency}
                      onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Paramètres d'email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres d'email</CardTitle>
              <CardDescription>
                Configurez les options d'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSettingsSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email d'expédition</Label>
                    <Input 
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email administrateur</Label>
                    <Input 
                      id="adminEmail"
                      type="email"
                      value={emailSettings.adminEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, adminEmail: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableOrderConfirmation">Confirmation de commande</Label>
                      <p className="text-sm text-muted-foreground">
                        Envoyer un email de confirmation pour les nouvelles commandes
                      </p>
                    </div>
                    <Switch 
                      id="enableOrderConfirmation"
                      checked={emailSettings.enableOrderConfirmation}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, enableOrderConfirmation: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enablePaymentConfirmation">Confirmation de paiement</Label>
                      <p className="text-sm text-muted-foreground">
                        Envoyer un email de confirmation pour les paiements
                      </p>
                    </div>
                    <Switch 
                      id="enablePaymentConfirmation"
                      checked={emailSettings.enablePaymentConfirmation}
                      onCheckedChange={(checked) => setEmailSettings({...emailSettings, enablePaymentConfirmation: checked})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailSignature">Signature d'email</Label>
                  <Input 
                    id="emailSignature"
                    value={emailSettings.emailSignature}
                    onChange={(e) => setEmailSettings({...emailSettings, emailSignature: e.target.value})}
                  />
                </div>
                
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer les modifications
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Paramètres de sécurité */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Gérez les options de sécurité pour votre site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Informations d'administrateur</h3>
                  <div className="rounded border p-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{user?.email || "fatoudial.mbodj@ucad.edu.sn"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rôle:</span>
                      <span>Administrateur</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dernière connexion:</span>
                      <span>{new Date().toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Changer le mot de passe</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  <Button className="mt-4">
                    Changer le mot de passe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
