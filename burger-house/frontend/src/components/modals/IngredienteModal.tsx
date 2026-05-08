import { useState, useEffect } from 'react';
import { Ingrediente } from '../../types';

interface Props {
  editando?: Ingrediente | null;
  onClose: () => void;
  onSave: (data: Partial<Ingrediente>) => void;
}

export default function IngredienteModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio_adicional: 0, imagen_url: '', disponible: true });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre,
        descripcion: editando.descripcion || '',
        precio_adicional: editando.precio_adicional,
        imagen_url: editando.imagen_url || '',
        disponible: editando.disponible,
      });
    }
  }, [editando]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-semibold mb-6">{editando ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none" required />
            <input type="number" step="0.01" placeholder="Precio adicional" value={form.precio_adicional}
              onChange={(e) => setForm({ ...form, precio_adicional: parseFloat(e.target.value) || 0 })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none" />
          </div>
          <input type="url" placeholder="URL de la imagen" value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none" />
          {form.imagen_url && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
              <img src={form.imagen_url} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit"
              className="px-6 py-3 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 transition-colors">{editando ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
