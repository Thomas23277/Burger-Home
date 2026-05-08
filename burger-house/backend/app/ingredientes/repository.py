from typing import Optional, List
from sqlmodel import Session, select
from app.models import Ingrediente


class IngredienteRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Ingrediente]:
        return list(self.session.exec(select(Ingrediente)).all())

    def get_by_id(self, id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, id)

    def create(self, data: "IngredienteCreate") -> Ingrediente:
        ingrediente = Ingrediente(**data.model_dump())
        self.session.add(ingrediente)
        self.session.flush()
        return ingrediente

    def update(self, id: int, data: "IngredienteUpdate") -> Optional[Ingrediente]:
        ingrediente = self.get_by_id(id)
        if not ingrediente:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(ingrediente, key, value)
        self.session.flush()
        return ingrediente

    def soft_delete(self, id: int) -> Optional[Ingrediente]:
        ingrediente = self.get_by_id(id)
        if not ingrediente:
            return None
        ingrediente.disponible = False
        self.session.flush()
        return ingrediente
