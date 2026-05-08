import { Usuario } from '../types';
import { fetchApi } from './api';

export const getUsuarios = () => fetchApi<Usuario[]>('/usuarios');
export const createUsuario = (data: Partial<Usuario & { password: string }>) =>
  fetchApi<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(data) });
