import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usuariosService from '../services/usuarios';
import UsuarioModal from '../components/modals/UsuarioModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';

export default function Usuarios() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosService.getUsuarios,
  });

  const createMut = useMutation({
    mutationFn: usuariosService.createUsuario,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); setModalOpen(false); },
  });

  if (isLoading) return <LoadingSpinner color="indigo" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">👤 Usuarios</h1>
            <p className="text-gray-500 mt-1">Gestiona los usuarios del sistema</p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg">
            + Nuevo Usuario
          </button>
        </div>

        <div className="grid gap-4">
          {usuarios?.length === 0 ? (
            <EmptyState icon="👤" title="No hay usuarios todavía" subtitle="Crea tu primer usuario para empezar" />
          ) : (
            usuarios?.map((user) => (
              <div key={user.id} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-xl text-gray-800">{user.nombre}</h3>
                  <p className="text-gray-500 text-sm mt-1">@{user.username} &middot; {user.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    user.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.rol}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>

        {modalOpen && (
          <UsuarioModal onClose={() => setModalOpen(false)} onSave={(data) => createMut.mutate(data)} />
        )}
      </div>
    </div>
  );
}
