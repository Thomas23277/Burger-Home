import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProductos, createProducto, updateProducto, deleteProducto, getCategorias, getIngredientes } from '../services/api';

export default function Productos() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio_base: '',
    imagenes_url: '',
    stock_cantidad: '',
    disponible: true,
    categorias: [],
    ingredientes: [],
  });

  const { data: productos, isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  });

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  });

  const { data: ingredientes } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  });

  const createMut = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      resetForm();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateProducto(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => queryClient.invalidateQueries(['productos']),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditando(null);
    setFormData({ nombre: '', descripcion: '', precio_base: '', imagenes_url: '', stock_cantidad: '', disponible: true, categorias: [], ingredientes: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      precio_base: parseFloat(formData.precio_base) || 0,
      stock_cantidad: parseInt(formData.stock_cantidad) || 0,
    };
    if (editando) {
      updateMut.mutate({ id: editando, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleEdit = (prod) => {
    setEditando(prod.id);
    setFormData({
      nombre: prod.nombre,
      descripcion: prod.descripcion || '',
      precio_base: prod.precio_base?.toString() || '',
      imagenes_url: prod.imagenes_url || '',
      stock_cantidad: prod.stock_cantidad?.toString() || '',
      disponible: prod.disponible,
      categorias: prod.categorias?.map(c => ({ categoria_id: c.id, es_principal: c.es_principal })) || [],
      ingredientes: prod.ingredientes?.map(i => ({ ingrediente_id: i.id, es_removible: false })) || [],
    });
    setShowForm(true);
  };

  const toggleCategoria = (categoriaId) => {
    setFormData(prev => {
      const exists = prev.categorias.find(c => c.categoria_id === categoriaId);
      if (exists) {
        return { ...prev, categorias: prev.categorias.filter(c => c.categoria_id !== categoriaId) };
      }
      return { ...prev, categorias: [...prev.categorias, { categoria_id: categoriaId, es_principal: prev.categorias.length === 0 }] };
    });
  };

  const toggleIngrediente = (ingamberienteId) => {
    setFormData(prev => {
      const exists = prev.ingredientes.find(i => i.ingrediente_id === ingamberienteId);
      if (exists) {
        return { ...prev, ingredientes: prev.ingredientes.filter(i => i.ingrediente_id !== ingamberienteId) };
      }
      return { ...prev, ingredientes: [...prev.ingredientes, { ingrediente_id: ingamberienteId, es_removible: false }] };
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">🍔 Productos</h1>
            <p className="text-gray-500 mt-1">Crea y modifica productos del menú</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Producto'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Hamburguesa Clásica" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio base ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={formData.precio_base} 
                    onChange={(e) => setFormData({ ...formData, precio_base: e.target.value })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    required 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  placeholder="Descripción del producto..." 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                  rows={3}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
                  <input 
                    type="text" 
                    placeholder="https://..." 
                    value={formData.imagenes_url} 
                    onChange={(e) => setFormData({ ...formData, imagenes_url: e.target.value })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.stock_cantidad} 
                    onChange={(e) => setFormData({ ...formData, stock_cantidad: e.target.value })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={formData.disponible} 
                  onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })} 
                  className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                />
                <span className="text-gray-700 font-medium">Disponible para pedidos</span>
              </label>

              {categorias && categorias.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Categorías</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorias.map(cat => (
                      <button 
                        type="button" 
                        key={cat.id} 
                        onClick={() => toggleCategoria(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.categorias.find(c => c.categoria_id === cat.id) 
                            ? 'bg-amber-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {cat.nombre} {formData.categorias.find(c => c.categoria_id === cat.id && c.es_principal) && '⭐'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {ingredientes && ingredientes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-gray-800">Ingredientes</h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredientes.map(ing => (
                      <button 
                        type="button" 
                        key={ing.id} 
                        onClick={() => toggleIngrediente(ing.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          formData.ingredientes.find(i => i.ingrediente_id === ing.id) 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {ing.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              >
                {editando ? '💾 Actualizar' : '✅ Crear Producto'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos?.map((prod) => (
            <div key={prod.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {prod.imagenes_url ? (
                <img src={prod.imagenes_url} alt={prod.nombre} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <span className="text-6xl">🍔</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-xl text-gray-800">{prod.nombre}</h3>
                  <span className="text-amber-500 font-bold text-xl">${(prod.precio_base || 0).toFixed(2)}</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{prod.descripcion}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {prod.categorias?.map(c => (
                    <span key={c.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">{c.nombre}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <Link to={`/productos/${prod.id}`} className="text-amber-500 hover:underline text-sm font-medium">
                    Ver detalle →
                  </Link>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${prod.disponible ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {prod.disponible ? '✓ Disponible' : '✕ No disponible'}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(prod)} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">✏️ Editar</button>
                    <button onClick={() => deleteMut.mutate(prod.id)} className="bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium">🗑️</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {productos?.length === 0 && (
            <div className="col-span-full bg-white p-12 rounded-2xl shadow-md text-center">
              <div className="text-6xl mb-4">🍔</div>
              <p className="text-gray-500 text-lg">No hay productos todavía</p>
              <p className="text-gray-400 text-sm mt-2">Crea tu primer producto para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}