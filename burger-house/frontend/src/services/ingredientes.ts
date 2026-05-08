import { Ingrediente } from '../types';
import { fetchApi } from './api';

export const getIngredientes = () => fetchApi<Ingrediente[]>('/ingredientes');
export const getIngrediente = (id: number) => fetchApi<Ingrediente>(`/ingredientes/${id}`);
export const createIngrediente = (data: Partial<Ingrediente>) =>
  fetchApi<Ingrediente>('/ingredientes', { method: 'POST', body: JSON.stringify(data) });
export const updateIngrediente = (id: number, data: Partial<Ingrediente>) =>
  fetchApi<Ingrediente>(`/ingredientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteIngrediente = (id: number) =>
  fetchApi<{ message: string }>(`/ingredientes/${id}`, { method: 'DELETE' });
