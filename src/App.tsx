import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/auth';
import { LoginForm } from './components/auth/login-form';
import { DashboardLayout } from './layout/dashboard';
import { NewsPage } from './pages/News';
import { ProductsPage } from './pages/Products';
import { CategoriesPage } from './pages/Categories';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <LoginForm />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="news" element={<NewsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;