
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { Plus, Edit, UserCog, Shield, Key } from "lucide-react";

const AdminAccounts = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      firstName: "Admin",
      lastName: "Principal",
      email: "admin@example.com",
      role: "SUPER_ADMIN",
      isActive: true,
      createdAt: new Date("2023-01-01"),
      lastLogin: new Date("2024-01-15")
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Support",
      email: "sarah@example.com",
      role: "SUPPORT",
      isActive: true,
      createdAt: new Date("2023-06-15"),
      lastLogin: new Date("2024-01-14")
    },
    {
      id: 3,
      firstName: "Michel",
      lastName: "Manager",
      email: "michel@example.com",
      role: "MANAGER",
      isActive: false,
      createdAt: new Date("2023-03-10"),
      lastLogin: new Date("2024-01-10")
    }
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  const getRoleBadge = (role: string) => {
    const configs = {
      "SUPER_ADMIN": { label: "Super Admin", variant: "default" as const },
      "MANAGER": { label: "Manager", variant: "secondary" as const },
      "SUPPORT": { label: "Support", variant: "outline" as const }
    };
    
    const config = configs[role as keyof typeof configs] || configs.SUPPORT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-50 text-green-700">Actif</Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700">Inactif</Badge>
    );
  };

  const handleCreateAdmin = () => {
    toast({
      title: "Compte créé",
      description: "Le nouveau compte administrateur a été créé avec succès."
    });
  };

  const handleUpdateAdmin = () => {
    toast({
      title: "Compte mis à jour",
      description: "Les informations du compte ont été mises à jour."
    });
    setSelectedAdmin(null);
  };

  const permissions = {
    "SUPER_ADMIN": [
      "Accès complet au système",
      "Gestion des comptes admin",
      "Modification des paramètres système",
      "Accès aux données sensibles"
    ],
    "MANAGER": [
      "Gestion des commandes",
      "Gestion des utilisateurs",
      "Gestion du contenu",
      "Statistiques et rapports"
    ],
    "SUPPORT": [
      "Support client",
      "Consultation des commandes",
      "Messagerie",
      "FAQ et assistance"
    ]
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des comptes administrateurs</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un compte admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau compte administrateur</DialogTitle>
              <DialogDescription>
                Créez un nouveau compte avec des permissions spécifiques
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input placeholder="Prénom" />
                </div>
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input placeholder="Nom" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@exemple.com" />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mot de passe temporaire</Label>
                <Input type="password" placeholder="Mot de passe temporaire" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Compte actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateAdmin}>Créer le compte</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total admins</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comptes actifs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter(a => a.isActive).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins.filter(a => a.role === 'SUPER_ADMIN').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des comptes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Comptes administrateurs</CardTitle>
          <CardDescription>Gérez les accès et permissions des administrateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Administrateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="font-medium">{admin.firstName} {admin.lastName}</div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{getRoleBadge(admin.role)}</TableCell>
                    <TableCell>{getStatusBadge(admin.isActive)}</TableCell>
                    <TableCell>{admin.createdAt.toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell>{admin.lastLogin.toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedAdmin(admin)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifier le compte</DialogTitle>
                            <DialogDescription>
                              Modifiez les informations de {selectedAdmin?.firstName} {selectedAdmin?.lastName}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Prénom</Label>
                                <Input defaultValue={selectedAdmin?.firstName} />
                              </div>
                              <div className="space-y-2">
                                <Label>Nom</Label>
                                <Input defaultValue={selectedAdmin?.lastName} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input type="email" defaultValue={selectedAdmin?.email} />
                            </div>
                            <div className="space-y-2">
                              <Label>Rôle</Label>
                              <Select defaultValue={selectedAdmin?.role}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                  <SelectItem value="MANAGER">Manager</SelectItem>
                                  <SelectItem value="SUPPORT">Support</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="active-edit" defaultChecked={selectedAdmin?.isActive} />
                              <Label htmlFor="active-edit">Compte actif</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleUpdateAdmin}>Sauvegarder</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Permissions par rôle */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions par rôle</CardTitle>
          <CardDescription>Aperçu des permissions accordées à chaque rôle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(permissions).map(([role, perms]) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="mb-3">{getRoleBadge(role)}</div>
                <ul className="space-y-2">
                  {perms.map((perm, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAccounts;
