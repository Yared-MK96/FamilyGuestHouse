import { Routes, Route } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute, AdminRoute } from './routes';

// Public pages (with Navbar/Footer — rendered by App root div)
import Navbar    from './components/navbar';
import Footer    from './components/footer';
import Home      from './pages/Home';
import Rooms     from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Booking   from './pages/Booking';
import About     from './pages/About';
import Contact   from './pages/Contact';
import Login     from './pages/Login';
import Register  from './pages/Register';
import NotFound  from './pages/NotFound';

// Dashboard sub-pages
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* ── Admin / Dashboard (own layout, no Navbar/Footer) ── */}
      <Route element={<AdminRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/dashboard/rooms"     element={<div className="p-4 text-gray-600">Rooms Management — coming soon</div>} />
          <Route path="/dashboard/bookings"  element={<div className="p-4 text-gray-600">Bookings Management — coming soon</div>} />
          <Route path="/dashboard/customers" element={<div className="p-4 text-gray-600">Customers — coming soon</div>} />
          <Route path="/dashboard/settings"  element={<div className="p-4 text-gray-600">Settings — coming soon</div>} />
        </Route>
      </Route>

      {/* ── Public / Guest pages (shared Navbar + Footer wrapper) ── */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/rooms"     element={<Rooms />} />
                <Route path="/rooms/:id" element={<RoomDetails />} />
                <Route path="/about"     element={<About />} />
                <Route path="/contact"   element={<Contact />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/register"  element={<Register />} />

                {/* Protected: must be logged in */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/booking" element={<Booking />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
