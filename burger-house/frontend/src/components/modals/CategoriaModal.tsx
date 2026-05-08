import { useState, useEffect } from 'react';
import { Categoria } from '../../types';

interface Props {
  editando?: Categoria | null;
  onClose: () => void;
  onSave: (data: Partial<Categoria>) => void;
}

export default function CategoriaModal({ editando, onClose, onSave }: Props) {
  const [form, setForm] = useState({ nombre: '', descripcion: '', imagen_url: '', parent_id: undefined as number | undefined, es_activa: true });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre,
        descripcion: editando.descripcion || '',
        imagen_url: editando.imagen_url || '',
        parent_id: editando.parent_id ?? undefined,
        es_activa: editando.es_activa,
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
        <h2 className="text-xl font-semibold mb-6">{editando ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <div className="grid gap-4">
          <input type="text" placeholder="Nombre" value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none" required />
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none" rows={3} />
          <input type="url" placeholder="URL de la imagen" value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none" />
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
              className="px-6 py-3 rounded-xl font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">{editando ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
