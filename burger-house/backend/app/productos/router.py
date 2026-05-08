from fastapi import APIRouter, status
from typing import List
from app.productos.schemas import ProductoCreate, ProductoUpdate, ProductoResponse
import app.productos.service as service

router = APIRouter()


@router.get("/productos", response_model=List[ProductoResponse])
def get_productos():
    return service.get_all()


@router.get("/productos/{id}", response_model=ProductoResponse)
def get_producto(id: int):
    return service.get_by_id(id)


@router.post("/productos", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
def create_producto(data: ProductoCreate):
    return service.create(data)


@router.put("/productos/{id}", response_model=ProductoResponse)
def update_producto(id: int, data: ProductoUpdate):
    return service.update(id, data)


@router.delete("/productos/{id}")
def delete_producto(id: int):
    return service.delete(id)
