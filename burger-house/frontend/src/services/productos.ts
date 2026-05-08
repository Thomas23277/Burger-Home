import { Producto } from '../types';
import { fetchApi } from './api';

export const getProductos = () => fetchApi<Producto[]>('/productos');
export const getProducto = (id: number) => fetchApi<Producto>(`/productos/${id}`);
export const createProducto = (data: Partial<Producto>) =>
  fetchApi<Producto>('/productos', { method: 'POST', body: JSON.stringify(data) });
export const updateProducto = (id: number, data: Partial<Producto>) =>
  fetchApi<Producto>(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProducto = (id: number) =>
  fetchApi<{ message: string }>(`/productos/${id}`, { method: 'DELETE' });
