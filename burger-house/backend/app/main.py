from typing import Optional, List, Annotated
from fastapi import FastAPI, Query, Path, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables, engine
from app.routers import router
from app.schemas import PaginationParams

app = FastAPI(
    title="Burger House API",
    description="API para gestión de restaurant de hamburguesas",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {"message": "Burger House API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/productos/buscar")
def buscar_productos(
    q: Annotated[str, Query(min_length=2, max_length=50, description="Texto a buscar")],
    categoria_id: Annotated[Optional[int], Query(description="Filtrar por categoría")] = None,
    disponible: Annotated[Optional[bool], Query(description="Filtrar por disponibilidad")] = None,
    skip: Annotated[int, Query(ge=0, description="Registros a saltar")] = 0,
    limit: Annotated[int, Query(ge=1, le=100, description="Cantidad de registros")] = 10,
):
    from app.repository import Repository, UnitOfWork
    from app.models import Producto
    
    with UnitOfWork() as uow:
        query = uow.session.query(Producto)
        
        if q:
            query = query.filter(Producto.nombre.ilike(f"%{q}%"))
        if categoria_id:
            from app.models import ProductoCategoria
            query = query.join(ProductoCategoria).filter(ProductoCategoria.categoria_id == categoria_id)
        if disponible is not None:
            query = query.filter(Producto.disponible == disponible)
        
        total = query.count()
        productos = query.offset(skip).limit(limit).all()
        
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "resultados": len(productos)
        }