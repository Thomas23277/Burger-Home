from typing import List
from fastapi import APIRouter, status
from app.pedidos.schemas import PedidoCreate, PedidoUpdate, PedidoResponse
import app.pedidos.service as service

router = APIRouter()


@router.get("/pedidos", response_model=List[PedidoResponse])
def get_pedidos():
    return service.get_all()


@router.get("/pedidos/{id}", response_model=PedidoResponse)
def get_pedido(id: int):
    return service.get_by_id(id)


@router.post("/pedidos", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
def create_pedido(data: PedidoCreate):
    return service.create(data)


@router.put("/pedidos/{id}", response_model=PedidoResponse)
def update_pedido(id: int, data: PedidoUpdate):
    return service.update(id, data)
