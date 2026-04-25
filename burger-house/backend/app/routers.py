# Categorías
from fastapi import APIRouter, HTTPException, status
from typing import List
from app.schemas import (
    CategoriaCreate, CategoriaUpdate, CategoriaResponse,
    IngredienteCreate, IngredienteUpdate, IngredienteResponse,
    ProductoCreate, ProductoUpdate, ProductoResponse,
    UsuarioCreate, UsuarioResponse,
    PedidoCreate, PedidoUpdate, PedidoResponse
)
import app.services as services

router = APIRouter()

# ===== CATEGORÍAS =====

@router.get("/categorias", response_model=List[CategoriaResponse])
def get_categorias():
    return services.get_all_categorias()


@router.get("/categorias/{id}", response_model=CategoriaResponse)
def get_categoria(id: int):
    return services.get_categoria_by_id(id)


@router.post("/categorias", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_categoria(data: CategoriaCreate):
    return services.create_categoria(data)


@router.put("/categorias/{id}", response_model=CategoriaResponse)
def update_categoria(id: int, data: CategoriaUpdate):
    return services.update_categoria(id, data)


@router.delete("/categorias/{id}")
def delete_categoria(id: int):
    return services.delete_categoria(id)


# ===== INGREDIENTES =====

@router.get("/ingredientes", response_model=List[IngredienteResponse])
def get_ingredientes():
    return services.get_all_ingredientes()


@router.get("/ingredientes/{id}", response_model=IngredienteResponse)
def get_ingrediente(id: int):
    return services.get_ingrediente_by_id(id)


@router.post("/ingredientes", response_model=IngredienteResponse, status_code=status.HTTP_201_CREATED)
def create_ingrediente(data: IngredienteCreate):
    return services.create_ingrediente(data)


@router.put("/ingredientes/{id}", response_model=IngredienteResponse)
def update_ingrediente(id: int, data: IngredienteUpdate):
    return services.update_ingrediente(id, data)


@router.delete("/ingredientes/{id}")
def delete_ingrediente(id: int):
    return services.delete_ingrediente(id)


# ===== PRODUCTOS =====

@router.get("/productos", response_model=List[ProductoResponse])
def get_productos():
    return services.get_all_productos()


@router.get("/productos/{id}", response_model=ProductoResponse)
def get_producto(id: int):
    return services.get_producto_by_id(id)


@router.post("/productos", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def create_producto(data: ProductoCreate):
    return services.create_producto(data)


@router.put("/productos/{id}", response_model=ProductoResponse)
def update_producto(id: int, data: ProductoUpdate):
    return services.update_producto(id, data)


@router.delete("/productos/{id}")
def delete_producto(id: int):
    return services.delete_producto(id)


# ===== USUARIOS =====

@router.get("/usuarios", response_model=List[UsuarioResponse])
def get_usuarios():
    return services.get_all_usuarios()


@router.post("/usuarios", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def create_usuario(data: UsuarioCreate):
    return services.create_usuario(data)


# ===== PEDIDOS =====

@router.get("/pedidos", response_model=List[PedidoResponse])
def get_pedidos():
    return services.get_all_pedidos()


@router.get("/pedidos/{id}", response_model=PedidoResponse)
def get_pedido(id: int):
    return services.get_pedido_by_id(id)


@router.post("/pedidos", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
def create_pedido(data: PedidoCreate):
    return services.create_pedido(data)


@router.put("/pedidos/{id}", response_model=PedidoResponse)
def update_pedido(id: int, data: PedidoUpdate):
    return services.update_pedido(id, data)