# Burger House - Lista de Verificación del Proyecto Integrador

## Backend (FastAPI + SQLModel)

- [x] **Entorno**: Uso de .venv, requirements.txt y FastAPI funcionando en modo dev.
- [x] **Modelado**: Tablas creadas con SQLModel incluyendo relaciones Relationship (1:N y N:N).
- [x] **Validación**: Uso de Annotated, Query y Path para reglas de negocio (longitudes, rangos).
- [x] **CRUD Persistente**: Endpoints funcionales para Crear, Leer, Actualizar y Borrar en SQLite.
- [x] **Seguridad de Datos**: Implementación de response_model para no filtrar datos sensibles.
- [x] **Estructura**: Código organizado por módulos (routers, schemas, services, models, repository).

## Frontend (React + Vite)

- [x] **Setup**: Proyecto creado con Vite y estructura de carpetas limpia.
- [x] **Componentes**: Uso de componentes funcionales y Props.
- [x] **Estilos**: Interfaz construida íntegramente con clases de utilidad de Tailwind CSS.
- [x] **Navegación**: Configuración de react-router-dom con rutas dinámicas (/productos/:id).
- [x] **Estado Local**: Uso de useState para el manejo de formularios.

## Integración y Server State

- [x] **Lectura (useQuery)**: Listados y detalles consumiendo datos reales de la API.
- [x] **Escritura (useMutation)**: Formularios que envían datos al backend con éxito.
- [x] **Sincronización**: Uso de invalidateQueries para refrescar la UI automáticamente.
- [x] **Feedback**: Gestión visual de estados de "Cargando..." y "Error" en las peticiones.

## Video de Presentación

- [ ] **Duración**: El video cumple con el tiempo estipulado (15 minutos).
- [x] **Audio/Video**: Voz clara y resolución que permite leer el código.
- [ ] **Demo**: Se muestra el flujo completo desde la creación hasta la persistencia en la DB.

---

## Resumen de Implementación

### Backend - Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /categorias | Listar categorías |
| POST | /categorias | Crear categoría |
| PUT | /categorias/{id} | Actualizar categoría |
| DELETE | /categorias/{id} | Eliminar categoría (soft/hard delete) |
| GET | /ingredientes | Listar ingredientes |
| POST | /ingredientes | Crear ingrediente |
| PUT | /ingredientes/{id} | Actualizar ingrediente |
| DELETE | /ingredientes/{id} | Eliminar ingrediente (soft/hard delete) |
| GET | /productos | Listar productos |
| GET | /productos/{id} | Ver detalle de producto |
| GET | /productos/buscar | Buscar productos (con filtros Annotated/Query) |
| POST | /productos | Crear producto |
| PUT | /productos/{id} | Actualizar producto |
| DELETE | /productos/{id} | Eliminar producto (soft/hard delete) |
| GET | /usuarios | Listar usuarios |
| POST | /usuarios | Crear usuario |
| GET | /pedidos | Listar pedidos |
| POST | /pedidos | Crear pedido |
| PUT | /pedidos/{id} | Actualizar estado del pedido |
| GET | /health | Health check |

### Tecnologías Utilizadas

**Backend:**
- FastAPI (Framework web Python)
- SQLModel (ORM + validación Pydantic)
- SQLite (Base de datos)
- Uvicorn (Servidor ASGI)
- Unit of Work + Repository Pattern

**Frontend:**
- React 18
- Vite (Build tool)
- React Query (TanStack Query)
- React Router DOM (Navegación con rutas dinámicas)
- Tailwind CSS (Estilos)

### Patrones Implementados

1. **Unit of Work + Repository**: Transacciones seguras
2. **Service Layer**: Lógica de negocio separada
3. **Soft/Hard Delete**: Eliminación inteligente según estado de pedidos

---

## Para Instalar y Ejecutar

```bash
# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```