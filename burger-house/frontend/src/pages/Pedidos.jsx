import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPedidos, updatePedido, getProductos, getUsuarios, createPedido } from '../services/api';

export default function Pedidos() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ usuario_id: '', notas: '', detalles: [] });

  const { data: pedidos, isLoading } = useQuery({
    queryKey: ['pedidos'],
    queryFn: getPedidos,
  });

  const { data: productos } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  });

  const { data: usuarios } = useQuery({
    queryKey: ['usuarios'],
    queryFn: getUsuarios,
  });

  const createMut = useMutation({
    mutationFn: createPedido,
    onSuccess: () => {
      queryClient.invalidateQueries(['pedidos']);
      resetForm();
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updatePedido(id, data),
    onSuccess: () => queryClient.invalidateQueries(['pedidos']),
  });

  const resetForm = () => {
    setShowForm(false);
    setFormData({ usuario_id: '', notas: '', detalles: [] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.usuario_id) return;
    createMut.mutate({
      ...formData,
      usuario_id: parseInt(formData.usuario_id)
    });
  };

  const addDetalle = (productoId) => {
    const prod = productos.find(p => p.id === productoId);
    if (prod) {
      setFormData(prev => ({
        ...prev,
        detalles: [...prev.detalles, { producto_id: productoId, cantidad: 1, notas: '' }]
      }));
    }
  };

  const removeDetalle = (index) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index)
    }));
  };

  const updateDetalle = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      detalles: prev.detalles.map((d, i) => i === index ? { ...d, [field]: value } : d)
    }));
  };

  const cambiarEstado = (id, nuevoEstado) => {
    updateMut.mutate({ id, data: { estado: nuevoEstado } });
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmado: 'bg-blue-100 text-blue-700 border-blue-300',
      en_preparacion: 'bg-purple-100 text-purple-700 border-purple-300',
      listo: 'bg-green-100 text-green-700 border-green-300',
      entregado: 'bg-gray-100 text-gray-700 border-gray-300',
      cancelado: 'bg-red-100 text-red-700 border-red-300',
    };
    return colores[estado] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">📋 Pedidos</h1>
            <p className="text-gray-500 mt-1">Visualiza y gestiona los pedidos</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            {showForm ? '✕ Cancelar' : '+ Nuevo Pedido'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Nuevo Pedido</h2>
            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <select 
                  value={formData.usuario_id} 
                  onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Seleccionar usuario</option>
                  {usuarios?.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.username})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas del pedido</label>
                <textarea 
                  placeholder="Notas especiales..." 
                  value={formData.notas} 
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })} 
                  className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  rows={2}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-800">Agregar productos</h3>
                <div className="flex flex-wrap gap-2">
                  {productos?.filter(p => p.disponible).map(p => (
                    <button 
                      type="button" 
                      key={p.id} 
                      onClick={() => addDetalle(p.id)} 
                      className="bg-gray-100 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors"
                    >
                      + {p.nombre} (${p.precio_base?.toFixed(2)})
                    </button>
                  ))}
                </div>
              </div>

              {formData.detalles.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4 text-gray-800">Detalles del pedido</h3>
                  {formData.detalles.map((detalle, index) => {
                    const prod = productos?.find(p => p.id === detalle.producto_id);
                    return (
                      <div key={index} className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
                        <span className="flex-1 font-medium">{prod?.nombre}</span>
                        <input 
                          type="number" 
                          min="1" 
                          value={detalle.cantidad} 
                          onChange={(e) => updateDetalle(index, 'cantidad', parseInt(e.target.value) || 1)} 
                          className="border-2 border-gray-200 p-2 w-20 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Notas" 
                          value={detalle.notas} 
                          onChange={(e) => updateDetalle(index, 'notas', e.target.value)} 
                          className="border-2 border-gray-200 p-2 flex-1 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeDetalle(index)} 
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button 
                type="submit" 
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.detalles.length === 0 || !formData.usuario_id}
              >
                ✅ Crear Pedido
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {pedidos?.map((pedido) => (
            <div key={pedido.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-xl text-gray-800">Pedido #{pedido.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(pedido.estado)}`}>
                      {pedido.estado}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">Usuario ID: {pedido.usuario_id}</p>
                  <p className="text-gray-400 text-xs mt-1">{new Date(pedido.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-600 font-bold text-2xl">${(pedido.total || 0).toFixed(2)}</p>
                </div>
              </div>
              {pedido.notas && (
                <div className="bg-yellow-50 p-3 rounded-xl mb-4">
                  <p className="text-yellow-800 text-sm"><strong>Notas:</strong> {pedido.notas}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {pedido.estado === 'pendiente' && (
                  <button onClick={() => cambiarEstado(pedido.id, 'confirmado')} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm">✓ Confirmar</button>
                )}
                {pedido.estado === 'confirmado' && (
                  <button onClick={() => cambiarEstado(pedido.id, 'en_preparacion')} className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm">🔥 En Preparación</button>
                )}
                {pedido.estado === 'en_preparacion' && (
                  <button onClick={() => cambiarEstado(pedido.id, 'listo')} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium text-sm">✓ Marcar Listo</button>
                )}
                {pedido.estado === 'listo' && (
                  <button onClick={() => cambiarEstado(pedido.id, 'entregado')} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm">📦 Entregar</button>
                )}
                {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                  <button onClick={() => cambiarEstado(pedido.id, 'cancelado')} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm">✕ Cancelar</button>
                )}
              </div>
            </div>
          ))}
          {pedidos?.length === 0 && (
            <div className="bg-white p-12 rounded-2xl shadow-md text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-500 text-lg">No hay pedidos todavía</p>
              <p className="text-gray-400 text-sm mt-2">Crea tu primer pedido para empezar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}