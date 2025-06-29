
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Filter, Clock } from "lucide-react";

const AdminHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const activities = [
    {
      id: 1,
      user: "Admin Principal",
      action: "Création commande",
      details: "Commande #12345 créée pour client Marie Dupont",
      timestamp: new Date("2024-01-15T10:30:00"),
      type: "create",
      ip: "192.168.1.100"
    },
    {
      id: 2,
      user: "Sarah Support",
      action: "Modification utilisateur",
      details: "Modification du profil utilisateur jean.martin@email.com",
      timestamp: new Date("2024-01-15T09:15:00"),
      type: "update",
      ip: "192.168.1.101"
    },
    {
      id: 3,
      user: "Admin Principal",
      action: "Suppression",
      details: "Suppression du livre temporaire #temp-789",
      timestamp: new Date("2024-01-14T16:45:00"),
      type: "delete",
      ip: "192.168.1.100"
    },
    {
      id: 4,
      user: "Michel Manager",
      action: "Export données",
      details: "Export des commandes du mois de décembre 2023",
      timestamp: new Date("2024-01-14T14:20:00"),
      type: "export",
      ip: "192.168.1.102"
    },
    {
      id: 5,
      user: "Sarah Support",
      action: "Connexion",
      details: "Connexion réussie au panel d'administration",
      timestamp: new Date("2024-01-14T08:00:00"),
      type: "login",
      ip: "192.168.1.101"
    }
  ];

  const getActionBadge = (type: string) => {
    const configs = {
      "create": { label: "Création", variant: "default" as const },
      "update": { label: "Modification", variant: "secondary" as const },
      "delete": { label: "Suppression", variant: "destructive" as const },
      "export": { label: "Export", variant: "outline" as const },
      "login": { label: "Connexion", variant: "outline" as const }
    };
    
    const config = configs[type as keyof typeof configs] || configs.create;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || activity.type === actionFilter;
    const matchesUser = userFilter === "all" || activity.user === userFilter;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExportHistory = () => {
    // Logique d'export en CSV ou PDF
    console.log("Export de l'historique...");
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Historique des actions</h1>
        <Button onClick={handleExportHistory} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ce mois</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Recherchez et filtrez l'historique des actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par utilisateur, action ou détails..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="create">Création</SelectItem>
                  <SelectItem value="update">Modification</SelectItem>
                  <SelectItem value="delete">Suppression</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="login">Connexion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les utilisateurs</SelectItem>
                  <SelectItem value="Admin Principal">Admin Principal</SelectItem>
                  <SelectItem value="Sarah Support">Sarah Support</SelectItem>
                  <SelectItem value="Michel Manager">Michel Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal d'activité */}
      <Card>
        <CardHeader>
          <CardTitle>Journal d'activité</CardTitle>
          <CardDescription>
            {filteredActivities.length} action{filteredActivities.length !== 1 ? "s" : ""} trouvée{filteredActivities.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Détails</TableHead>
                  <TableHead>Adresse IP</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="font-medium">{formatDateTime(activity.timestamp)}</div>
                    </TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>
                      <div className="max-w-md truncate" title={activity.details}>
                        {activity.details}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {activity.ip}
                      </code>
                    </TableCell>
                    <TableCell>{getActionBadge(activity.type)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune activité trouvée avec les filtres actuels
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHistory;
