import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LoginForm } from './components/auth/login-form';
import { DashboardLayout } from './layout/dashboard';
import { ProductsPage } from './pages/Products';
import { ProtectedRoute } from './routes/protectedRoutes';
import NewsList from './pages/News/NewsList';
import CategoryTable from './pages/Categories/CategoryList';

function App() {
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
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoryTable />} />
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
