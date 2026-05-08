from typing import List
from fastapi import APIRouter, status
from app.usuarios.schemas import UsuarioCreate, UsuarioResponse
import app.usuarios.service as service

router = APIRouter()


@router.get("/usuarios", response_model=List[UsuarioResponse])
def get_usuarios():
    return service.get_all()


@router.post("/usuarios", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def create_usuario(data: UsuarioCreate):
    return service.create(data)
