# 🍔 Burger House - Sistema de Gestión de Restaurant

Sistema de gestión integral para un restaurant de hamburguesas, desarrollado como proyecto final de Programación 3.

## 🎥 Video de Presentación

**Link del video:** (https://youtu.be/lCkPhimLXms?feature=shared)

---

## 📋 Descripción

Burger House permite administrar:
- **Categorías** del menú
- **Ingredientes** disponibles
- **Productos** con sus relaciones (many-to-many)
- **Pedidos** con seguimiento de estados
- **Usuarios** del sistema

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web moderno de Python
- **SQLModel** - ORM con validación de datos
- **Unit of Work + Repository** - Patrones de persistencia (Unidad 5)
- **Pydantic** - Validación automática de datos
- **SQLite** - Base de datos

### Frontend
- **React 18** - Biblioteca para interfaces
- **Vite** - Herramienta de build
- **React Query (TanStack Query)** - Gestión de estado del servidor (Unidad 4)
- **React Router** - Navegación SPA con rutas dinámicas
- **Tailwind CSS** - Framework de estilos (Unidad 5)

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Python 3.10+
- Node.js 18+
- npm

### Backend

```bash
cd burger-house/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

El backend estará disponible en: http://127.0.0.1:8000
Documentación Swagger: http://127.0.0.1:8000/docs

### Frontend

```bash
cd burger-house/frontend
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## 📁 Estructura del Proyecto

```
burger-house/
├── backend/
│   ├── app/
│   │   ├── main.py        # Punto de entrada FastAPI
│   │   ├── models.py      # Modelos SQLModel (tablas)
│   │   ├── schemas.py     # Schemas Pydantic (validación)
│   │   ├── database.py    # Configuración de conexión
│   │   ├── repository.py  # Repository + Unit of Work
│   │   ├── services.py    # Lógica de negocio
│   │   └── routers.py     # Endpoints de la API
│   ├── venv/              # Entorno virtual
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Configuración de rutas
│   │   ├── pages/         # Páginas del sistema
│   │   ├── components/    # Componentes reutilizables
│   │   └── services/      # Llamadas a la API
│   └── package.json
├── CHECKLIST.md           # Lista de verificación
├── README.md
├── INICIAR_BACKEND.bat
├── INICIAR_FRONTEND.bat
└── LEEME.txt
```

## 📝 API Endpoints

### Categorías
- `GET /categorias` - Listar todas
- `POST /categorias` - Crear
- `PUT /categorias/{id}` - Actualizar
- `DELETE /categorias/{id}` - Eliminar (soft/hard delete)

### Ingredientes
- `GET /ingredientes` - Listar todos
- `POST /ingredientes` - Crear
- `PUT /ingredientes/{id}` - Actualizar
- `DELETE /ingredientes/{id}` - Eliminar (soft/hard delete)

### Productos
- `GET /productos` - Listar todos
- `GET /productos/{id}` - Ver detalle
- `GET /productos/buscar` - Buscar con filtros (Annotated/Query)
- `POST /productos` - Crear
- `PUT /productos/{id}` - Actualizar
- `DELETE /productos/{id}` - Eliminar (soft/hard delete)

### Pedidos
- `GET /pedidos` - Listar todos
- `POST /pedidos` - Crear
- `PUT /pedidos/{id}` - Actualizar estado

### Búsqueda con Validación
- `GET /productos/buscar?q=texto&categoria_id=1&disponible=true&skip=0&limit=10`

## 🎯 Patrones Implementados

### Unit of Work + Repository (Unidad 5)
Agrupa operaciones en transacciones seguras. Si falla una, se hace rollback de todas.

### React Query (Unidad 4)
- `useQuery` - Para leer datos
- `useMutation` - Para crear/editar/eliminar
- `invalidateQueries` - Para refrescar después de cambios

### Soft/Hard Delete
- Si una entidad tiene pedidos activos → Soft delete (desactiva)
- Si no tiene pedidos activos → Hard delete (borra todo)

## 📖 Conceptos Clave para el Examen

1. **FastAPI**: Framework web de Python, rápido, con docs automáticas
2. **Pydantic**: Valida datos automáticamente
3. **SQLModel**: Combina SQLAlchemy + Pydantic (ORM + validación)
4. **Unit of Work**: Agrupa operaciones en transacciones
5. **Repository Pattern**: Abstrae acceso a la base de datos
6. **React Query**: Gestiona estado del servidor (caching, sync)
7. **useQuery vs useMutation**: Leer vs Crear/Editar/Eliminar
8. **Annotated/Query**: Validaciones en endpoints
9. **Rutas dinámicas**: useParams para URLs como /productos/:id

## 👨‍💻 Autor

Thomas Agüero - COM3

## 📄 Licencia

Este proyecto es para fines educativos.
