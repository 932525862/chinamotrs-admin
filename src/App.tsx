import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoginForm } from './components/auth/login-form';
import { DashboardLayout } from './layout/dashboard';
import { ProtectedRoute } from './routes/protectedRoutes';
import NewsList from './pages/News/NewsList';
import CategoryTable from './pages/Categories/CategoryList';
import PartnerList from './pages/Partners/PartnerList';
import ProductsList from './pages/Products/ProductsList';
import OrderList from './pages/Orders/OrdersList';
import BannersList from './pages/Banners/BannersList';

function App() {

  console.log(import.meta.env.VITE_API_BASE_URL, "Base")
  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route path="/login" element={<LoginForm />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="news" replace />} />
            <Route path="news" element={<NewsList />} />
            <Route path="partners" element={<PartnerList />} />
            <Route path="banners" element={<BannersList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="categories" element={<CategoryTable />} />
            <Route path="products" element={<ProductsList />} />
            <Route path="*" element={<Navigate to="news" replace />} />
          </Route>
        </Route>

        {/* Default fallback */}
        <Route path="*" element={<Navigate to="/dashboard/news" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </Router>
  );
}

export default App;
