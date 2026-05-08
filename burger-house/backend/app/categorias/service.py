from typing import List
from fastapi import HTTPException
from app.models import Categoria
from app.categorias.schemas import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.categorias.repository import CategoriaRepository
from app.core import UnitOfWork


def _build_response(categoria: Categoria) -> CategoriaResponse:
    subcategorias = []
    if categoria.children:
        subcategorias = [_build_response(h) for h in categoria.children if h.es_activa]
    return CategoriaResponse(
        id=categoria.id,
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        imagen_url=categoria.imagen_url,
        parent_id=categoria.parent_id,
        es_activa=categoria.es_activa,
        subcategorias=subcategorias,
    )


def get_all() -> List[CategoriaResponse]:
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categorias = repo.get_all()
        activas = [c for c in categorias if c.es_activa and c.parent_id is None]
        return [_build_response(c) for c in activas]


def get_by_id(id: int) -> CategoriaResponse:
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.get_by_id(id)
        if not categoria or not categoria.es_activa:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return _build_response(categoria)


def create(data: CategoriaCreate) -> CategoriaResponse:
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.create(data)
        return _build_response(categoria)


def update(id: int, data: CategoriaUpdate) -> CategoriaResponse:
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.update(id, data)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return _build_response(categoria)


def delete(id: int) -> dict:
    with UnitOfWork() as uow:
        repo = CategoriaRepository(uow.session)
        categoria = repo.get_by_id(id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")

        # Desactivar también subcategorías
        for child in categoria.children:
            child.es_activa = False

        categoria.es_activa = False
        return {"message": "Categoría desactivada correctamente", "type": "soft_delete"}
