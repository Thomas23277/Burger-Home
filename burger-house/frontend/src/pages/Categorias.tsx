import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoriasService from '../services/categorias';
import CategoriaModal from '../components/modals/CategoriaModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Categoria } from '../types';

export default function Categorias() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);

  const { data: categorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriasService.getCategorias,
  });

  const createMut = useMutation({
    mutationFn: categoriasService.createCategoria,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); setModalOpen(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Categoria> }) => categoriasService.updateCategoria(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categorias'] }); setModalOpen(false); },
  });

  const deleteMut = useMutation({
    mutationFn: categoriasService.deleteCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categorias'] }),
  });

  const handleEdit = (cat: Categoria) => {
    setEditando(cat);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Categoria>) => {
    if (editando) {
      updateMut.mutate({ id: editando.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📁 Categorías</h1>
            <p className="text-gray-500 mt-1">Gestiona las categorías del menú</p>
          </div>
          <button onClick={() => { setEditando(null); setModalOpen(true); }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
            + Nueva Categoría
          </button>
        </div>

        <div className="grid gap-4">
          {categorias?.length === 0 ? (
            <EmptyState icon="📁" title="No hay categorías todavía" subtitle="Crea tu primera categoría para empezar" />
          ) : (
            categorias?.map((cat) => (
              <div key={cat.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {cat.imagen_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={cat.imagen_url} alt={cat.nombre} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl flex-shrink-0">📁</div>
                  )}
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800">{cat.nombre}</h3>
                    <p className="text-gray-500 text-sm mt-1">{cat.descripcion}</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => handleEdit(cat)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">✏️ Editar</button>
                  <button onClick={() => deleteMut.mutate(cat.id)}
                    className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 font-medium">🗑️ Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <CategoriaModal editando={editando} onClose={() => { setModalOpen(false); setEditando(null); }} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
