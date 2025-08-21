
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Search, UserCheck, UserMinus, UserCog } from "lucide-react";
import type { User, UserRole } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

// Note: Normalement, ces fonctions seraient dans un fichier API séparé
const userApi = {
  getAllUsers: async (token: string): Promise<User[]> => {
    // Simulons des données pour la démonstration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            email: "admin@example.com",
            firstName: "Admin",
            lastName: "User",
            role: "ADMIN",
            createdAt: new Date("2023-01-01"),
            updatedAt: new Date("2023-01-01"),
            isActive: true,
            lastLogin: new Date("2023-05-15")
          },
          {
            id: "2",
            email: "manager@example.com",
            firstName: "Manager",
            lastName: "User",
            role: "MANAGER",
            createdAt: new Date("2023-02-15"),
            updatedAt: new Date("2023-02-15"),
            isActive: true,
            lastLogin: new Date("2023-05-10")
          },
          {
            id: "3",
            email: "john.doe@example.com",
            firstName: "John",
            lastName: "Doe",
            role: "USER",
            createdAt: new Date("2023-03-10"),
            updatedAt: new Date("2023-03-10"),
            isActive: true,
            lastLogin: new Date("2023-05-01")
          },
          {
            id: "4",
            email: "jane.smith@example.com",
            firstName: "Jane",
            lastName: "Smith",
            role: "USER",
            createdAt: new Date("2023-04-05"),
            updatedAt: new Date("2023-04-05"),
            isActive: true,
            lastLogin: new Date("2023-04-29")
          },
          {
            id: "5",
            email: "inactive@example.com",
            firstName: "Inactive",
            lastName: "User",
            role: "USER",
            createdAt: new Date("2023-01-20"),
            updatedAt: new Date("2023-03-15"),
            isActive: false,
            lastLogin: new Date("2023-02-10")
          }
        ]);
      }, 1000);
    });
  },
  
  updateUserStatus: async (token: string, userId: string, isActive: boolean): Promise<User> => {
    // Simule une mise à jour du statut utilisateur
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          email: "user@example.com",
          firstName: "Updated",
          lastName: "User",
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: isActive,
          lastLogin: new Date()
        });
      }, 500);
    });
  },
  
  updateUserRole: async (token: string, userId: string, role: UserRole): Promise<User> => {
    // Simule une mise à jour du rôle utilisateur
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          email: "user@example.com",
          firstName: "Updated",
          lastName: "User",
          role: role,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
          lastLogin: new Date()
        });
      }, 500);
    });
  }
};

const AdminUsers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | "">("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        const data = await userApi.getAllUsers(localStorage.getItem('token') || '');
        setUsers(data);
        setFilteredUsers(data);
      } catch (err: any) {
        setError("Impossible de charger les utilisateurs");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(
        user => 
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter && roleFilter !== "all") {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter && statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter(user => user.isActive === isActive);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleUpdateRole = async () => {
    if (!user || !selectedUser || !newRole) return;
    
    setIsUpdating(true);
    try {
      const updatedUser = await userApi.updateUserRole(localStorage.getItem('token') || '', selectedUser.id, newRole);
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle de ${selectedUser.firstName} ${selectedUser.lastName} a été mis à jour.`
      });
      
      setSelectedUser(null);
      setNewRole("");
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur",
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!user) return;
    
    try {
      const updatedUser = await userApi.updateUserStatus(localStorage.getItem('token') || '', user.id, !user.isActive);
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === updatedUser.id ? updatedUser : u
        )
      );
      
      toast({
        title: updatedUser.isActive ? "Compte activé" : "Compte désactivé",
        description: `Le compte de ${user.firstName} ${user.lastName} a été ${updatedUser.isActive ? "activé" : "désactivé"}.`
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du compte",
        variant: "destructive"
      });
      console.error(err);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleConfigs: Record<UserRole, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      ADMIN: { label: "Admin", variant: "default" },
      MANAGER: { label: "Manager", variant: "secondary" },
      USER: { label: "Utilisateur", variant: "outline" }
    };

    const config = roleConfigs[role];
    
    return (
      <Badge variant={config.variant} className="whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };
  
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Actif</Badge>
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactif</Badge>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Recherchez et filtrez les utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""} trouvé{filteredUsers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun utilisateur trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : "Jamais"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role);
                              }}
                            >
                              <UserCog className="h-4 w-4 mr-1" />
                              Rôle
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Modifier le rôle</DialogTitle>
                              <DialogDescription>
                                Changer le rôle de {selectedUser?.firstName} {selectedUser?.lastName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Rôle actuel</label>
                                  <div className="mt-1">{selectedUser?.role && getRoleBadge(selectedUser.role)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Nouveau rôle</label>
                                  <Select value={newRole} onValueChange={(val: UserRole) => setNewRole(val)}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Sélectionner un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ADMIN">Admin</SelectItem>
                                      <SelectItem value="MANAGER">Manager</SelectItem>
                                      <SelectItem value="USER">Utilisateur</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={handleUpdateRole} disabled={isUpdating || newRole === selectedUser?.role}>
                                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Mettre à jour
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant={user.isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.isActive ? (
                            <>
                              <UserMinus className="h-4 w-4 mr-1" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activer
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
