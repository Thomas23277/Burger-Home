import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as pedidosService from '../services/pedidos';
import * as productosService from '../services/productos';
import * as usuariosService from '../services/usuarios';
import PedidoModal from '../components/modals/PedidoModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

const estadoColores: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  confirmado: 'bg-blue-100 text-blue-700 border-blue-300',
  en_preparacion: 'bg-purple-100 text-purple-700 border-purple-300',
  listo: 'bg-green-100 text-green-700 border-green-300',
  entregado: 'bg-gray-100 text-gray-700 border-gray-300',
  cancelado: 'bg-red-100 text-red-700 border-red-300',
};

export default function Pedidos() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: pedidos, isLoading } = useQuery({ queryKey: ['pedidos'], queryFn: pedidosService.getPedidos });
  const { data: productos } = useQuery({ queryKey: ['productos'], queryFn: productosService.getProductos });
  const { data: usuarios } = useQuery({ queryKey: ['usuarios'], queryFn: usuariosService.getUsuarios });

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => pedidosService.updatePedido(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pedidos'] }),
  });

  const createMut = useMutation({
    mutationFn: pedidosService.createPedido,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['pedidos'] }); setModalOpen(false); },
  });

  if (isLoading) return <LoadingSpinner color="purple" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📋 Pedidos</h1>
            <p className="text-gray-500 mt-1">Visualiza y gestiona los pedidos</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg">
            + Nuevo Pedido
          </button>
        </div>

        <div className="grid gap-4">
          {pedidos?.length === 0 ? (
            <EmptyState icon="📋" title="No hay pedidos todavía" subtitle="Crea tu primer pedido para empezar" />
          ) : (
            pedidos?.map((pedido) => (
              <div key={pedido.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-xl text-gray-800">Pedido #{pedido.id}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${estadoColores[pedido.estado] || ''}`}>
                        {pedido.estado}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{new Date(pedido.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-purple-600 font-bold text-2xl">${(pedido.total || 0).toFixed(2)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {pedido.estado === 'pendiente' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'confirmado' } })}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm">✓ Confirmar</button>
                  )}
                  {pedido.estado === 'confirmado' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'en_preparacion' } })}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 text-sm">🔥 En Preparación</button>
                  )}
                  {pedido.estado === 'en_preparacion' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'listo' } })}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm">✓ Marcar Listo</button>
                  )}
                  {pedido.estado === 'listo' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'entregado' } })}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 text-sm">📦 Entregar</button>
                  )}
                  {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                    <button onClick={() => updateMut.mutate({ id: pedido.id, data: { estado: 'cancelado' } })}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm">✕ Cancelar</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {modalOpen && productos && usuarios && (
          <PedidoModal productos={productos} usuarios={usuarios}
            onClose={() => setModalOpen(false)}
            onSave={(data) => createMut.mutate(data)} />
        )}
      </div>
    </div>
  );
}
