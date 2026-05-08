import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Categorias from '../pages/Categorias';
import Ingredientes from '../pages/Ingredientes';
import Productos from '../pages/Productos';
import DetalleProducto from '../pages/DetalleProducto';
import Pedidos from '../pages/Pedidos';
import Usuarios from '../pages/Usuarios';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/ingredientes" element={<Ingredientes />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
