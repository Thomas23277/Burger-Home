import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import * as productosService from '../services/productos';
import * as categoriasService from '../services/categorias';
import * as ingredientesService from '../services/ingredientes';
import ProductoModal from '../components/modals/ProductoModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

export default function Productos() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<any>(null);

  const { data: productos, isLoading } = useQuery({ queryKey: ['productos'], queryFn: productosService.getProductos });
  const { data: categorias } = useQuery({ queryKey: ['categorias'], queryFn: categoriasService.getCategorias });
  const { data: ingredientes } = useQuery({ queryKey: ['ingredientes'], queryFn: ingredientesService.getIngredientes });

  const createMut = useMutation({
    mutationFn: productosService.createProducto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: any) => productosService.updateProducto(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); setModalOpen(false); },
  });

  const deleteMut = useMutation({
    mutationFn: productosService.deleteProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">🍔 Productos</h1>
            <p className="text-gray-500 mt-1">Crea y modifica productos del menú</p>
          </div>
          <button onClick={() => { setEditando(null); setModalOpen(true); }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg">
            + Nuevo Producto
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos?.length === 0 ? (
            <div className="col-span-full"><EmptyState icon="🍔" title="No hay productos todavía" subtitle="Crea tu primer producto para empezar" /></div>
          ) : (
            productos?.map((prod) => (
              <div key={prod.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden">
                <div className={`w-full h-48 flex items-center justify-center ${prod.imagenes_url ? '' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}>
                  {prod.imagenes_url ? <img src={prod.imagenes_url} alt={prod.nombre} className="w-full h-full object-cover" /> : <span className="text-6xl">🍔</span>}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-xl text-gray-800">{prod.nombre}</h3>
                    <span className="text-amber-500 font-bold text-xl">${(prod.precio_base || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">{prod.descripcion}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <Link to={`/productos/${prod.id}`} className="text-amber-500 hover:underline text-sm font-medium">Ver detalle →</Link>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditando(prod); setModalOpen(true); }}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 text-sm font-medium">✏️ Editar</button>
                      <button onClick={() => deleteMut.mutate(prod.id)}
                        className="bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 text-sm font-medium">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <ProductoModal editando={editando} categorias={categorias || []} ingredientes={ingredientes || []}
            onClose={() => { setModalOpen(false); setEditando(null); }}
            onSave={(data) => editando ? updateMut.mutate({ id: editando.id, data }) : createMut.mutate(data)} />
        )}
      </div>
    </div>
  );
}
