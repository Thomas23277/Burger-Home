import { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (data: { username: string; email: string; nombre: string; password: string; rol: string }) => void;
}

export default function UsuarioModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState({ username: '', email: '', nombre: '', password: '', rol: 'cliente' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-4">
        <h2 className="text-xl font-semibold mb-6">Nuevo Usuario</h2>
        <div className="grid gap-4">
          <input type="text" placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none" required />
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none" required />
          <input type="text" placeholder="Nombre completo" value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none" required />
          <input type="password" placeholder="Contraseña" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none" required />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="border-2 border-gray-200 p-3 rounded-xl focus:border-indigo-500 focus:outline-none">
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium bg-gray-200 hover:bg-gray-300 transition-colors">Cancelar</button>
            <button type="submit"
              className="px-6 py-3 rounded-xl font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition-colors">Crear</button>
          </div>
        </div>
      </form>
    </div>
  );
}
