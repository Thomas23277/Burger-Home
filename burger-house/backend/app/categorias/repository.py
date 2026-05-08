from typing import Optional, List
from sqlmodel import Session, select
from app.models import Categoria


class CategoriaRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Categoria]:
        return list(self.session.exec(select(Categoria)).all())

    def get_by_id(self, id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, id)

    def create(self, data: "CategoriaCreate") -> Categoria:
        categoria = Categoria(**data.model_dump())
        self.session.add(categoria)
        self.session.flush()
        return categoria

    def update(self, id: int, data: "CategoriaUpdate") -> Optional[Categoria]:
        categoria = self.get_by_id(id)
        if not categoria:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(categoria, key, value)
        self.session.flush()
        return categoria

    def soft_delete(self, id: int) -> Optional[Categoria]:
        categoria = self.get_by_id(id)
        if not categoria:
            return None
        categoria.es_activa = False
        self.session.flush()
        return categoria
