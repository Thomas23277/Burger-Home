import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import Ingredientes from './pages/Ingredientes';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Pedidos from './pages/Pedidos';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/ingredientes" element={<Ingredientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<DetalleProducto />} />
            <Route path="/pedidos" element={<Pedidos />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}