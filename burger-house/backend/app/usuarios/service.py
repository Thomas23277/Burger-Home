from typing import List
from fastapi import HTTPException
from app.models import Usuario
from app.usuarios.schemas import UsuarioCreate, UsuarioResponse
from app.usuarios.repository import UsuarioRepository
from app.core import UnitOfWork


def get_all() -> List[UsuarioResponse]:
    with UnitOfWork() as uow:
        repo = UsuarioRepository(uow.session)
        usuarios = repo.get_all()
        return [UsuarioResponse(
            id=u.id, username=u.username, email=u.email,
            nombre=u.nombre, rol=u.rol, created_at=u.created_at
        ) for u in usuarios]


def create(data: UsuarioCreate) -> UsuarioResponse:
    with UnitOfWork() as uow:
        repo = UsuarioRepository(uow.session)
        existing = repo.get_by_username(data.username)
        if existing:
            raise HTTPException(status_code=400, detail="El username ya existe")
        hashed_password = f"hashed_{data.password}"
        usuario = repo.create(
            username=data.username, email=data.email,
            nombre=data.nombre, rol=data.rol,
            hashed_password=hashed_password,
        )
        return UsuarioResponse(
            id=usuario.id, username=usuario.username, email=usuario.email,
            nombre=usuario.nombre, rol=usuario.rol, created_at=usuario.created_at,
        )
