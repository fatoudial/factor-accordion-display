
import { Outlet } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import ChatbotButton from './ChatbotButton';

const Layout = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        <ChatbotButton />
      </div>
    </LanguageProvider>
  );
};

export default Layout;
