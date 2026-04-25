import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIngredientes, createIngrediente, updateIngrediente, deleteIngrediente } from '../services/api';

export default function Ingredientes() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true });

  const { data: ingredientes, isLoading } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  });

  const createMut = useMutation({
    mutationFn: createIngrediente,
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredientes']);
      resetForm();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateIngrediente(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ingredientes']);
      resetForm();
    },
  });

  const deleteMut = useMutation({
    mutationFn: deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries(['ingredientes']),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditando(null);
    setFormData({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editando) {
      updateMut.mutate({ id: editando, data: formData });
    } else {
      createMut.mutate(formData);
    }
  };

  const handleEdit = (ing) => {
    setEditando(ing.id);
    setFormData({ nombre: ing.nombre, descripcion: ing.descripcion || '', precio_adicional: ing.precio_adicional, imagen_url: ing.imagen_url || '', disponible: ing.disponible });
    setShowForm(true);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">🥬 Ingredientes</h1>
            <p className="text-gray-500 mt-1">Administra los ingredientes disponibles</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Ingrediente'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">{editando ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h2>
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej: Queso" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio adicional ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={formData.precio_adicional} 
                    onChange={(e) => setFormData({ ...formData, precio_adicional: parseFloat(e.target.value) || 0 })} 
                    className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  placeholder="Descripción del ingrediente..." 
                  value={formData.descripcion} 
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
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
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input 
                  type="checkbox" 
                  checked={formData.disponible} 
                  onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })} 
                  className="w-5 h-5 text-green-500 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 font-medium">Disponible</span>
              </label>
              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
              >
                {editando ? '💾 Actualizar' : '✅ Crear Ingrediente'}
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {ingredientes?.map((ing) => (
            <div key={ing.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex justify-between items-center">
              <div className="flex items-center gap-6">
                {ing.imagen_url ? (
                  <img src={ing.imagen_url} alt={ing.nombre} className="w-20 h-20 object-cover rounded-xl shadow" />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-3xl">🥬</div>
                )}
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">{ing.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1">{ing.descripcion}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-green-600 font-bold text-lg">+${ing.precio_adicional?.toFixed(2) || '0.00'}</span>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${ing.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {ing.disponible ? '✓ Disponible' : '✕ No disponible'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleEdit(ing)} 
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  ✏️ Editar
                </button>
                <button 
                  onClick={() => deleteMut.mutate(ing.id)} 
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
          {ingredientes?.length === 0 && (
            <div className="bg-white p-12 rounded-2xl shadow-md text-center">
              <div className="text-6xl mb-4">🥬</div>
              <p className="text-gray-500 text-lg">No hay ingredientes todavía</p>
              <p className="text-gray-400 text-sm mt-2">Crea tu primer ingrediente para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}