const API_URL = '';

const fetchApi = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
    throw new Error(error.detail || 'Error en la petición');
  }

  return response.json();
};

// ===== CATEGORÍAS =====
export const getCategorias = () => fetchApi('/categorias');
export const getCategoria = (id) => fetchApi(`/categorias/${id}`);
export const createCategoria = (data) => fetchApi('/categorias', { method: 'POST', body: JSON.stringify(data) });
export const updateCategoria = (id, data) => fetchApi(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategoria = (id) => fetchApi(`/categorias/${id}`, { method: 'DELETE' });

// ===== INGREDIENTES =====
export const getIngredientes = () => fetchApi('/ingredientes');
export const getIngrediente = (id) => fetchApi(`/ingredientes/${id}`);
export const createIngrediente = (data) => fetchApi('/ingredientes', { method: 'POST', body: JSON.stringify(data) });
export const updateIngrediente = (id, data) => fetchApi(`/ingredientes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteIngrediente = (id) => fetchApi(`/ingredientes/${id}`, { method: 'DELETE' });

// ===== PRODUCTOS =====
export const getProductos = () => fetchApi('/productos');
export const getProducto = (id) => fetchApi(`/productos/${id}`);
export const createProducto = (data) => fetchApi('/productos', { method: 'POST', body: JSON.stringify(data) });
export const updateProducto = (id, data) => fetchApi(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProducto = (id) => fetchApi(`/productos/${id}`, { method: 'DELETE' });

// ===== USUARIOS =====
export const getUsuarios = () => fetchApi('/usuarios');
export const createUsuario = (data) => fetchApi('/usuarios', { method: 'POST', body: JSON.stringify(data) });

// ===== PEDIDOS =====
export const getPedidos = () => fetchApi('/pedidos');
export const getPedido = (id) => fetchApi(`/pedidos/${id}`);
export const createPedido = (data) => fetchApi('/pedidos', { method: 'POST', body: JSON.stringify(data) });
export const updatePedido = (id, data) => fetchApi(`/pedidos/${id}`, { method: 'PUT', body: JSON.stringify(data) });