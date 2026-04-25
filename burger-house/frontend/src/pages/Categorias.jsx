import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/api';

export default function Categorias() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', imagen_url: '', es_activa: true });

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  });

  const createMut = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias']);
      resetForm();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateCategoria(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias']);
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries(['categorias']),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditando(null);
    setFormData({ nombre: '', descripcion: '', imagen_url: '', es_activa: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      updateMut.mutate({ id: editando, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const handleEdit = (cat) => {
    setEditando(cat.id);
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || '', imagen_url: cat.imagen_url || '', es_activa: cat.es_activa });
    setShowForm(true);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📁 Categorías</h1>
            <p className="text-gray-500 mt-1">Gestiona las categorías del menú</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            {showForm ? '✕ Cancelar' : '+ Nueva Categoría'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input 
                  type="text" 
                  placeholder="Ej: Hamburguesas" 
                  value={formData.nombre} 
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  requiamber 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  placeholder="Descripción de la categoría..." 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL de imagen</label>
                <input 
                  type="text" 
                  placeholder="https://..." 
                  value={formData.imagen_url} 
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={formData.es_activa} 
                  onChange={(e) => setFormData({ ...formData, es_activa: e.target.checked })} 
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">Categoría activa</span>
              </label>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              >
                {editando ? '💾 Actualizar' : '✅ Crear Categoría'}
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {categorias?.map((cat) => (
            <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex justify-between items-center">
              <div className="flex items-center gap-6">
                {cat.imagen_url ? (
                  <img src={cat.imagen_url} alt={cat.nombre} className="w-20 h-20 object-cover rounded-xl shadow" />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-3xl">📁</div>
                )}
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">{cat.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1">{cat.descripcion}</p>
                  <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${cat.es_activa ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {cat.es_activa ? '✓ Activa' : '✕ Inactiva'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(cat)} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => deleteMut.mutate(cat.id)} 
                  className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
          {categorias?.length === 0 && (
            <div className="bg-white p-12 rounded-2xl shadow-md text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-500 text-lg">No hay categorías todavía</p>
              <p className="text-gray-400 text-sm mt-2">Crea tu primera categoría para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}