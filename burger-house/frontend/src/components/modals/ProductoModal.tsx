import { useState, useEffect } from 'react';
import { Producto, Categoria, Ingrediente } from '../../types';

interface Props {
  editando?: Producto | null;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ProductoModal({ editando, categorias, ingredientes, onClose, onSave }: Props) {
  const [form, setForm] = useState<any>({
    nombre: '', descripcion: '', precio_base: '', imagenes_url: '',
    stock_cantidad: '', disponible: true, categorias: [], ingredientes: [],
  });

  useEffect(() => {
    if (editando) {
      setForm({
        nombre: editando.nombre, descripcion: editando.descripcion || '',
        precio_base: editando.precio_base?.toString() || '', imagenes_url: editando.imagenes_url || '',
        stock_cantidad: editando.stock_cantidad?.toString() || '', disponible: editando.disponible,
        categorias: editando.categorias?.map(c => ({ categoria_id: c.id, es_principal: c.es_principal })) || [],
        ingredientes: editando.ingredientes?.map(i => ({ ingrediente_id: i.id, es_removible: false })) || [],
      });
    }
  }, [editando]);

  const toggleCategoria = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.categorias.find((c: any) => c.categoria_id === id);
      if (exists) return { ...prev, categorias: prev.categorias.filter((c: any) => c.categoria_id !== id) };
      return { ...prev, categorias: [...prev.categorias, { categoria_id: id, es_principal: prev.categorias.length === 0 }] };
    });
  };

  const toggleIngrediente = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.ingredientes.find((i: any) => i.ingrediente_id === id);
      if (exists) return { ...prev, ingredientes: prev.ingredientes.filter((i: any) => i.ingrediente_id !== id) };
      return { ...prev, ingredientes: [...prev.ingredientes, { ingrediente_id: id, es_removible: false }] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      precio_base: parseFloat(form.precio_base) || 0,
      stock_cantidad: parseInt(form.stock_cantidad) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none" required />
            <input type="number" step="0.01" placeholder="Precio base" value={form.precio_base}
              onChange={(e) => setForm({ ...form, precio_base: e.target.value })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="url" placeholder="URL de la imagen" value={form.imagenes_url}
              onChange={(e) => setForm({ ...form, imagenes_url: e.target.value })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none" />
            <input type="number" placeholder="Stock" value={form.stock_cantidad}
              onChange={(e) => setForm({ ...form, stock_cantidad: e.target.value })}
              className="border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none" />
          </div>
          {form.imagenes_url && (
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100">
              <img src={form.imagenes_url} alt="Preview" className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <textarea placeholder="Descripción" value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none" rows={2} />
          {categorias.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button type="button" key={cat.id} onClick={() => toggleCategoria(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      form.categorias.find((c: any) => c.categoria_id === cat.id)
                        ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
          {ingredientes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {ingredientes.map((ing) => (
                  <button type="button" key={ing.id} onClick={() => toggleIngrediente(ing.id)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      form.ingredientes.find((i: any) => i.ingrediente_id === ing.id)
                        ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {ing.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit"
              className="px-6 py-3 rounded-xl font-medium bg-amber-500 text-white hover:bg-amber-600">{editando ? 'Actualizar' : 'Crear'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
