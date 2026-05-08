from typing import Optional, List
from sqlmodel import Session, select
from app.models import Usuario


class UsuarioRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Usuario]:
        return list(self.session.exec(select(Usuario)).all())

    def get_by_id(self, id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, id)

    def get_by_username(self, username: str) -> Optional[Usuario]:
        return self.session.exec(select(Usuario).where(Usuario.username == username)).first()

    def create(self, username: str, email: str, nombre: str, rol: str, hashed_password: str) -> Usuario:
        usuario = Usuario(
            username=username, email=email, nombre=nombre,
            rol=rol, hashed_password=hashed_password,
        )
        self.session.add(usuario)
        self.session.flush()
        return usuario
