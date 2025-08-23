
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import ChatbotButton from './ChatbotButton';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Layout;
