
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Chargement en cours...</span>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log("Non authentifié, redirection vers login");
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers la page d'accueil si non admin
  if (!isAdmin) {
    console.log("Non admin, redirection vers dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher le contenu protégé administrateur
  console.log("Utilisateur admin, affichage du contenu");
  return <>{children}</>;
};

export default AdminRoute;
