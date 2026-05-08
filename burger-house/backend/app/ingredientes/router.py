from fastapi import APIRouter, status
from typing import List
from app.ingredientes.schemas import IngredienteCreate, IngredienteUpdate, IngredienteResponse
import app.ingredientes.service as service

router = APIRouter()


@router.get("/ingredientes", response_model=List[IngredienteResponse])
def get_ingredientes():
    return service.get_all()


@router.get("/ingredientes/{id}", response_model=IngredienteResponse)
def get_ingrediente(id: int):
    return service.get_by_id(id)


@router.post("/ingredientes", response_model=IngredienteResponse, status_code=status.HTTP_201_CREATED)
def create_ingrediente(data: IngredienteCreate):
    return service.create(data)


@router.put("/ingredientes/{id}", response_model=IngredienteResponse)
def update_ingrediente(id: int, data: IngredienteUpdate):
    return service.update(id, data)


@router.delete("/ingredientes/{id}")
def delete_ingrediente(id: int):
    return service.delete(id)
