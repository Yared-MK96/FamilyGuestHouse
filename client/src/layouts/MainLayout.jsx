import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Outlet } from 'react-router-dom';

// Public layout — used by all guest-facing pages
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
