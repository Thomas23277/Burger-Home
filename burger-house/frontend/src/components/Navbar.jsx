import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  const links = [
    { path: '/', label: '🏠 Inicio', exact: true },
    { path: '/categorias', label: '📁 Categorías' },
    { path: '/ingredientes', label: '🥬 Ingredientes' },
    { path: '/productos', label: '🍔 Productos' },
    { path: '/pedidos', label: '📋 Pedidos' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-white font-bold text-xl">Burger House</span>
          </div>
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive(link.path, link.exact)
                    ? 'bg-white text-amber-600 shadow-md'
                    : 'text-amber-100 hover:bg-amber-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}