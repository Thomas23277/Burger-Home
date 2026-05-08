from typing import Optional, List
from sqlmodel import Session, select
from app.models import Pedido, PedidoDetalle


class PedidoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Pedido]:
        return list(self.session.exec(select(Pedido)).all())

    def get_by_id(self, id: int) -> Optional[Pedido]:
        return self.session.get(Pedido, id)

    def create(self, usuario_id: int, total: float, notas: Optional[str]) -> Pedido:
        pedido = Pedido(usuario_id=usuario_id, total=total, notas=notas)
        self.session.add(pedido)
        self.session.flush()
        return pedido

    def add_detalle(self, pedido_id: int, producto_id: int, cantidad: int,
                    precio_unitario: float, notas: Optional[str]) -> PedidoDetalle:
        detalle = PedidoDetalle(
            pedido_id=pedido_id, producto_id=producto_id, cantidad=cantidad,
            precio_unitario=precio_unitario, notas=notas,
        )
        self.session.add(detalle)
        self.session.flush()
        return detalle

    def update(self, id: int, data: "PedidoUpdate") -> Optional[Pedido]:
        pedido = self.get_by_id(id)
        if not pedido:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pedido, key, value)
        self.session.flush()
        return pedido
