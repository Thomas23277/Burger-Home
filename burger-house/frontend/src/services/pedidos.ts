import { Pedido } from '../types';
import { fetchApi } from './api';

export const getPedidos = () => fetchApi<Pedido[]>('/pedidos');
export const getPedido = (id: number) => fetchApi<Pedido>(`/pedidos/${id}`);
export const createPedido = (data: Partial<Pedido>) =>
  fetchApi<Pedido>('/pedidos', { method: 'POST', body: JSON.stringify(data) });
export const updatePedido = (id: number, data: Partial<Pedido>) =>
  fetchApi<Pedido>(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
