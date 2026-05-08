from fastapi import APIRouter, status
from typing import List
from app.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaResponse
import app.categorias.service as service

router = APIRouter()


@router.get("/categorias", response_model=List[CategoriaResponse])
def get_categorias():
    return service.get_all()


@router.get("/categorias/{id}", response_model=CategoriaResponse)
def get_categoria(id: int):
    return service.get_by_id(id)


@router.post("/categorias", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
def create_categoria(data: CategoriaCreate):
    return service.create(data)


@router.put("/categorias/{id}", response_model=CategoriaResponse)
def update_categoria(id: int, data: CategoriaUpdate):
    return service.update(id, data)


@router.delete("/categorias/{id}")
def delete_categoria(id: int):
    return service.delete(id)
