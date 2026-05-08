from typing import List
from fastapi import HTTPException
from app.pedidos.schemas import PedidoCreate, PedidoUpdate, PedidoResponse, PedidoDetalleResponse
from app.pedidos.repository import PedidoRepository
from app.productos.repository import ProductoRepository
from app.usuarios.repository import UsuarioRepository
from app.core import UnitOfWork


def _build_response(pedido) -> PedidoResponse:
    detalles = []
    if pedido.detalles:
        for d in pedido.detalles:
            detalles.append(PedidoDetalleResponse(
                id=d.id, producto_id=d.producto_id, cantidad=d.cantidad,
                precio_unitario=d.precio_unitario, notas=d.notas,
            ))
    return PedidoResponse(
        id=pedido.id, usuario_id=pedido.usuario_id, estado=pedido.estado,
        total=pedido.total, notas=pedido.notas, created_at=pedido.created_at,
        updated_at=pedido.updated_at, detalles=detalles,
    )


def get_all() -> List[PedidoResponse]:
    with UnitOfWork() as uow:
        repo = PedidoRepository(uow.session)
        pedidos = repo.get_all()
        return [_build_response(p) for p in pedidos]


def get_by_id(id: int) -> PedidoResponse:
    with UnitOfWork() as uow:
        repo = PedidoRepository(uow.session)
        pedido = repo.get_by_id(id)
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return _build_response(pedido)


def create(data: PedidoCreate) -> PedidoResponse:
    with UnitOfWork() as uow:
        usuario_repo = UsuarioRepository(uow.session)
        usuario = usuario_repo.get_by_id(data.usuario_id)
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        producto_repo = ProductoRepository(uow.session)

        total = 0.0
        for detalle in data.detalles:
            producto = producto_repo.get_by_id(detalle.producto_id)
            if not producto:
                raise HTTPException(status_code=404, detail=f"Producto {detalle.producto_id} no encontrado")
            total += producto.precio_base * detalle.cantidad

        pedido_repo = PedidoRepository(uow.session)
        pedido = pedido_repo.create(
            usuario_id=data.usuario_id, total=total, notas=data.notas,
        )

        for detalle in data.detalles:
            producto = producto_repo.get_by_id(detalle.producto_id)
            pedido_repo.add_detalle(
                pedido_id=pedido.id, producto_id=detalle.producto_id,
                cantidad=detalle.cantidad, precio_unitario=producto.precio_base,
                notas=detalle.notas,
            )

        uow.session.refresh(pedido)
        _ = pedido.detalles
        return _build_response(pedido)


def update(id: int, data: PedidoUpdate) -> PedidoResponse:
    with UnitOfWork() as uow:
        repo = PedidoRepository(uow.session)
        pedido = repo.update(id, data)
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return _build_response(pedido)
