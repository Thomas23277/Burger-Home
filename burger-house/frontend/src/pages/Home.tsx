import { Link } from 'react-router-dom';

const menuItems = [
  { path: '/categorias', label: 'Categorías', icon: '📁', desc: 'Gestiona las categorías del menú', color: 'from-blue-500 to-blue-600' },
  { path: '/ingredientes', label: 'Ingredientes', icon: '🥬', desc: 'Administra los ingredientes disponibles', color: 'from-green-500 to-green-600' },
  { path: '/productos', label: 'Productos', icon: '🍔', desc: 'Crea y modifica productos del menú', color: 'from-amber-500 to-amber-600' },
  { path: '/pedidos', label: 'Pedidos', icon: '📋', desc: 'Visualiza y gestiona los pedidos', color: 'from-purple-500 to-purple-600' },
  { path: '/usuarios', label: 'Usuarios', icon: '👤', desc: 'Gestiona los usuarios del sistema', color: 'from-indigo-500 to-indigo-600' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 text-white py-16 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🍔</div>
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Burger House</h1>
          <p className="text-xl text-amber-100 font-light">Sistema de Gestión Integral</p>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`block bg-gradient-to-br ${item.color} p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white`}>
              <div className="flex items-center gap-6">
                <span className="text-5xl bg-white/20 p-4 rounded-2xl">{item.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold mb-2">{item.label}</h2>
                  <p className="text-white/80 text-sm">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2026 Burger House - Sistema de Gestión</p>
      </footer>
    </div>
  );
}
