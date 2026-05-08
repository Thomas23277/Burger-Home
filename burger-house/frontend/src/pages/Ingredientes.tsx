import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ingredientesService from '../services/ingredientes';
import IngredienteModal from '../components/modals/IngredienteModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import { Ingrediente } from '../types';

export default function Ingredientes() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Ingrediente | null>(null);

  const { data: ingredientes, isLoading } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: ingredientesService.getIngredientes,
  });

  const createMut = useMutation({
    mutationFn: ingredientesService.createIngrediente,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); setModalOpen(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Ingrediente> }) => ingredientesService.updateIngrediente(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['ingredientes'] }); setModalOpen(false); },
  });

  const deleteMut = useMutation({
    mutationFn: ingredientesService.deleteIngrediente,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ingredientes'] }),
  });

  const handleEdit = (ing: Ingrediente) => {
    setEditando(ing);
    setModalOpen(true);
  };

  const handleSave = (data: Partial<Ingrediente>) => {
    if (editando) {
      updateMut.mutate({ id: editando.id, data });
    } else {
      createMut.mutate(data);
    }
  };

  if (isLoading) return <LoadingSpinner color="green" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">🥬 Ingredientes</h1>
            <p className="text-gray-500 mt-1">Administra los ingredientes disponibles</p>
          </div>
          <button onClick={() => { setEditando(null); setModalOpen(true); }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
            + Nuevo Ingrediente
          </button>
        </div>

        <div className="grid gap-4">
          {ingredientes?.length === 0 ? (
            <EmptyState icon="🥬" title="No hay ingredientes todavía" subtitle="Crea tu primer ingrediente para empezar" />
          ) : (
            ingredientes?.map((ing) => (
              <div key={ing.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {ing.imagen_url ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={ing.imagen_url} alt={ing.nombre} className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-2xl flex-shrink-0">🥬</div>
                  )}
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800">{ing.nombre}</h3>
                    <p className="text-green-600 font-bold mt-1">+${ing.precio_adicional?.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0">
                  <button onClick={() => handleEdit(ing)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium">✏️ Editar</button>
                  <button onClick={() => deleteMut.mutate(ing.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium">🗑️ Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <IngredienteModal editando={editando} onClose={() => { setModalOpen(false); setEditando(null); }} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
