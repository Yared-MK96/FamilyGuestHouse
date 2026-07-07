import { Routes, Route } from 'react-router-dom';

import AdminLayout from './admin/layouts/AdminLayout';

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

// Admin Pages
import AdminDashboard from './admin/pages/Dashboard';
import AdminRooms from './admin/pages/RoomsManager';
import AdminBookings from './admin/pages/BookingsManager';
import AdminPayments from './admin/pages/PaymentsManager';
import AdminUsers from './admin/pages/UsersManager';

function App() {
  return (
    <Routes>
      {/* ── Admin Portal ── */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"          element={<AdminDashboard />} />
          <Route path="/admin/rooms"    element={<AdminRooms />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/users"    element={<AdminUsers />} />
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
