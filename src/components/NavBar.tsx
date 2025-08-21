
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ShoppingBag, LogOut, ShoppingCart, Search, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const itemsCount = items ? items.length : 0;
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Utiliser useRef pour détecter la sortie de la zone de menu
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to search page or filter content
    if (searchQuery.trim()) {
      navigate(`/mock-orders?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fonction qui ferme le menu lorsqu'on quitte la zone
  const handleMouseLeave = () => {
    setIsMenuOpen(false);
  };
  
  const handleMouseEnter = () => {
    setIsMenuOpen(true);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-3"
            >
              <img
                src="/covers/logo.png"
                alt="Logo"
                className="h-[80px] w-auto"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-ts-indigo hover:text-ts-gold transition-colors">{t('nav.home')}</Link>
            <Link to="/chat-book" className="text-ts-indigo hover:text-ts-gold transition-colors">Créer un livre</Link>
            <Link to="/offers" className="text-ts-indigo hover:text-ts-gold transition-colors">{t('nav.offers')}</Link>
            <Link to="/process" className="text-ts-indigo hover:text-ts-gold transition-colors">{t('nav.how')}</Link>
            <Link to="/about" className="text-ts-indigo hover:text-ts-gold transition-colors">À propos</Link>
            <Link to="/contact" className="text-ts-indigo hover:text-ts-gold transition-colors">Contact</Link>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Rechercher"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <LanguageSelector />
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative" 
                onClick={() => navigate('/cart')}
                aria-label="Panier"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="destructive">
                    {itemsCount}
                  </Badge>
                )}
              </Button>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative rounded-full h-8 w-8 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin ? (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Tableau de bord Admin</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('nav.dashboard')}</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/user-orders")}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>{t('nav.orders')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={handleLogin}>{t('nav.login')}</Button>
                  <Button onClick={handleRegister}>{t('nav.register')}</Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={() => navigate('/cart')}
              aria-label="Panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs" variant="destructive">
                  {itemsCount}
                </Badge>
              )}
            </Button>
            <button 
              onClick={toggleMenu}
              className="text-ts-indigo focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Search bar */}
        {showSearch && (
          <form onSubmit={handleSearch} className="mt-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Rechercher une commande par référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            ref={menuRef} 
            className="md:hidden mt-4 pb-4 space-y-4 max-h-[70vh] overflow-y-auto"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            <Link to="/" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">{t('nav.home')}</Link>
            <Link to="/chat-book" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">Créer un livre</Link>
            <Link to="/offers" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">{t('nav.offers')}</Link>
            <Link to="/process" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">{t('nav.how')}</Link>
            <Link to="/about" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">À propos</Link>
            <Link to="/faq" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">FAQ</Link>
            <Link to="/contact" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">Contact</Link>
            {isAuthenticated ? (
              <>
                <div className="py-2 text-ts-indigo">
                  <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                {isAdmin ? (
                  <Link to="/admin" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Tableau de bord Admin</span>
                    </div>
                  </Link>
                ) : (
                  <Link to="/dashboard" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">{t('nav.dashboard')}</Link>
                )}
                <Link to="/user-orders" className="block text-ts-indigo hover:text-ts-gold transition-colors py-2">{t('nav.orders')}</Link>
                <Button onClick={handleLogout} variant="destructive" className="w-full mt-2">
                  {t('nav.logout')}
                </Button>
              </>
            ) : (
              <div className="space-y-2 mt-4">
                <Button onClick={handleLogin} variant="outline" className="w-full">
                  {t('nav.login')}
                </Button>
                <Button onClick={handleRegister} className="w-full">
                  {t('nav.register')}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
