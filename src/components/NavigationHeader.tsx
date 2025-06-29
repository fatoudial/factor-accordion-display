
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User } from 'lucide-react';

export const NavigationHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo uniquement */}
        <div className="flex items-center">
          <div 
            onClick={() => navigate('/')}
            className="cursor-pointer bg-ts-indigo text-white px-3 py-2 rounded-lg font-bold text-lg"
          >
            MON<br/>LIVRE<br/>SMS
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" onClick={() => navigate('/process')}>
            FAQ
          </Button>
          <Button variant="ghost" onClick={() => navigate('/designer')}>
            Mes conversations
          </Button>
          <Button variant="ghost" onClick={() => navigate('/orders')}>
            Suivi de commande
          </Button>
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profil
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Connexion
              </Button>
              <Button onClick={() => navigate('/register')}>
                Inscription
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
