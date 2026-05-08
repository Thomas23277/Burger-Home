import { Categoria } from '../types';
import { fetchApi } from './api';

export const getCategorias = () => fetchApi<Categoria[]>('/categorias');
export const getCategoria = (id: number) => fetchApi<Categoria>(`/categorias/${id}`);
export const createCategoria = (data: Partial<Categoria>) =>
  fetchApi<Categoria>('/categorias', { method: 'POST', body: JSON.stringify(data) });
export const updateCategoria = (id: number, data: Partial<Categoria>) =>
  fetchApi<Categoria>(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategoria = (id: number) =>
  fetchApi<{ message: string }>(`/categorias/${id}`, { method: 'DELETE' });
