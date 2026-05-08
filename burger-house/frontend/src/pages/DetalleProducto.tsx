import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducto } from '../services/productos';

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const productoId = parseInt(id || '0');

  const { data: producto, isLoading, error } = useQuery({
    queryKey: ['producto', productoId],
    queryFn: () => getProducto(productoId),
    enabled: productoId > 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-gray-500">Cargando...</span>
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-500 mb-4">El producto que buscas no existe o fue eliminado.</p>
          <Link to="/productos" className="text-amber-500 hover:underline">
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/productos" className="text-amber-500 hover:underline mb-4 inline-block">
          ← Volver a productos
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {producto.imagenes_url ? (
            <img src={producto.imagenes_url} alt={producto.nombre} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-8xl">🍔</span>
            </div>
          )}

          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>
              <span className="text-amber-500 font-bold text-3xl">${(producto.precio_base || 0).toFixed(2)}</span>
            </div>

            <p className="text-gray-600 text-lg mb-6">{producto.descripcion}</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.categorias?.length > 0 ? (
                    producto.categorias.map((cat) => (
                      <span key={cat.id} className={`px-3 py-1 rounded-full text-sm ${cat.es_principal ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                        {cat.nombre} {cat.es_principal && '⭐'}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Sin categoría</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.ingredientes?.length > 0 ? (
                    producto.ingredientes.map((ing) => (
                      <span key={ing.id} className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                        {ing.nombre} {ing.precio_adicional > 0 && `(+$${ing.precio_adicional})`}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Sin ingredientes</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${producto.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {producto.disponible ? '✓ Disponible' : '✕ No disponible'}
              </span>
              <span className="px-4 py-2 rounded-full text-sm bg-gray-100 text-gray-700">
                Stock: {producto.stock_cantidad}
              </span>
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p>ID: {producto.id}</p>
              <p>Creado: {new Date(producto.created_at).toLocaleString()}</p>
              <p>Actualizado: {new Date(producto.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}