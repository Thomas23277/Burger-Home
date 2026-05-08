import { useState } from 'react';
import { Usuario, Producto } from '../../types';

interface DetalleForm {
  producto_id: number;
  cantidad: number;
  notas: string;
}

interface Props {
  productos: Producto[];
  usuarios: Usuario[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function PedidoModal({ productos, usuarios, onClose, onSave }: Props) {
  const [form, setForm] = useState({ usuario_id: '', notas: '', detalles: [] as DetalleForm[] });

  const addDetalle = (productoId: number) => {
    setForm(prev => ({
      ...prev, detalles: [...prev.detalles, { producto_id: productoId, cantidad: 1, notas: '' }]
    }));
  };

  const removeDetalle = (index: number) => {
    setForm(prev => ({ ...prev, detalles: prev.detalles.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.usuario_id) return;
    onSave({ ...form, usuario_id: parseInt(form.usuario_id) });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">Nuevo Pedido</h2>
        <div className="grid gap-4">
          <select value={form.usuario_id} onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-purple-500 focus:outline-none" required>
            <option value="">Seleccionar usuario</option>
            {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
          </select>
          <div>
            <h3 className="font-semibold mb-2 text-sm">Productos</h3>
            <div className="flex flex-wrap gap-2">
              {productos.filter(p => p.disponible).map(p => (
                <button type="button" key={p.id} onClick={() => addDetalle(p.id)}
                  className="bg-gray-100 px-3 py-1.5 rounded-xl text-sm hover:bg-gray-200">+ {p.nombre}</button>
              ))}
            </div>
          </div>
          {form.detalles.map((d, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="flex-1 font-medium">{productos.find(p => p.id === d.producto_id)?.nombre}</span>
              <input type="number" min="1" value={d.cantidad}
                onChange={(e) => setForm(prev => ({
                  ...prev, detalles: prev.detalles.map((x, j) => j === i ? { ...x, cantidad: parseInt(e.target.value) || 1 } : x)
                }))}
                className="border-2 border-gray-200 p-2 w-20 rounded-lg" />
              <button type="button" onClick={() => removeDetalle(i)}
                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600">✕</button>
            </div>
          ))}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={form.detalles.length === 0 || !form.usuario_id}
              className="px-6 py-3 rounded-xl font-medium bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50">Crear</button>
          </div>
        </div>
      </form>
    </div>
  );
}
