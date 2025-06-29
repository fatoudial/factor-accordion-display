
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Bell, Plus, Send, Settings, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle commande reçue",
      message: "Une nouvelle commande #12345 vient d'être passée par Marie Dupont",
      type: "info",
      isRead: false,
      timestamp: new Date("2024-01-15T10:30:00"),
      priority: "normal"
    },
    {
      id: 2,
      title: "Paiement en attente",
      message: "Le paiement de la commande #12344 nécessite une vérification manuelle",
      type: "warning",
      isRead: false,
      timestamp: new Date("2024-01-15T09:15:00"),
      priority: "high"
    },
    {
      id: 3,
      title: "Commande livrée",
      message: "La commande #12340 a été livrée avec succès à Jean Martin",
      type: "success",
      isRead: true,
      timestamp: new Date("2024-01-14T16:45:00"),
      priority: "low"
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    newOrders: true,
    paymentIssues: true,
    deliveryUpdates: false,
    systemAlerts: true
  });

  const getNotificationIcon = (type: string) => {
    const icons = {
      "info": Info,
      "warning": AlertTriangle,
      "success": CheckCircle,
      "error": AlertCircle
    };
    const Icon = icons[type as keyof typeof icons] || Info;
    return Icon;
  };

  const getNotificationBadge = (type: string) => {
    const configs = {
      "info": { label: "Info", variant: "secondary" as const },
      "warning": { label: "Attention", variant: "destructive" as const },
      "success": { label: "Succès", variant: "default" as const },
      "error": { label: "Erreur", variant: "destructive" as const }
    };
    
    const config = configs[type as keyof typeof configs] || configs.info;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      "high": { label: "Haute", variant: "destructive" as const },
      "normal": { label: "Normale", variant: "secondary" as const },
      "low": { label: "Basse", variant: "outline" as const }
    };
    
    const config = configs[priority as keyof typeof configs] || configs.normal;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSendNotification = () => {
    toast({
      title: "Notification envoyée",
      description: "La notification a été envoyée à tous les administrateurs."
    });
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const handleSaveSettings = () => {
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences de notification ont été mises à jour."
    });
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer une notification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle notification</DialogTitle>
              <DialogDescription>
                Envoyez une notification à tous les administrateurs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Titre</Label>
                <Input placeholder="Titre de la notification" />
              </div>
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea placeholder="Contenu de la notification..." rows={3} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de notification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Attention</SelectItem>
                      <SelectItem value="success">Succès</SelectItem>
                      <SelectItem value="error">Erreur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priorité</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="low">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSendNotification}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications reçues</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Centre de notifications</CardTitle>
              <CardDescription>
                Consultez et gérez vos notifications administrateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-colors ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${
                            notification.type === 'warning' || notification.type === 'error' 
                              ? 'text-red-500' 
                              : notification.type === 'success' 
                                ? 'text-green-500' 
                                : 'text-blue-500'
                          }`} />
                          <div className="flex-1">
                            <h3 className="font-medium">{notification.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-xs text-gray-500">
                            {formatDateTime(notification.timestamp)}
                          </div>
                          <div className="flex gap-1">
                            {getNotificationBadge(notification.type)}
                            {getPriorityBadge(notification.priority)}
                          </div>
                        </div>
                      </div>
                      {!notification.isRead && (
                        <div className="flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Marquer comme lu
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Méthodes de notification</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir les notifications par email
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, emailNotifications: checked}))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications push</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir les notifications push dans le navigateur
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, pushNotifications: checked}))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications SMS</Label>
                      <p className="text-sm text-gray-500">
                        Recevoir les notifications urgentes par SMS
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, smsNotifications: checked}))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Types de notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouvelles commandes</Label>
                      <p className="text-sm text-gray-500">
                        Être notifié des nouvelles commandes
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.newOrders}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, newOrders: checked}))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Problèmes de paiement</Label>
                      <p className="text-sm text-gray-500">
                        Être notifié des problèmes de paiement
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.paymentIssues}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, paymentIssues: checked}))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mises à jour de livraison</Label>
                      <p className="text-sm text-gray-500">
                        Être notifié des mises à jour de livraison
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.deliveryUpdates}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, deliveryUpdates: checked}))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertes système</Label>
                      <p className="text-sm text-gray-500">
                        Être notifié des alertes système importantes
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({...prev, systemAlerts: checked}))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Sauvegarder les paramètres
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
