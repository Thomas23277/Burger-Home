from typing import Optional, List, Annotated
from fastapi import FastAPI, Query, Path, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.categorias.router import router as categorias_router
from app.ingredientes.router import router as ingredientes_router
from app.productos.router import router as productos_router
from app.usuarios.router import router as usuarios_router
from app.pedidos.router import router as pedidos_router

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

app.include_router(categorias_router)
app.include_router(ingredientes_router)
app.include_router(productos_router)
app.include_router(usuarios_router)
app.include_router(pedidos_router)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {"message": "Burger House API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}