from typing import Optional, List
from sqlmodel import Session, select
from app.models import Producto, ProductoCategoria, ProductoIngrediente


class ProductoRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(self) -> List[Producto]:
        return list(self.session.exec(select(Producto)).all())

    def get_by_id(self, id: int) -> Optional[Producto]:
        return self.session.get(Producto, id)

    def create(self, nombre: str, descripcion: Optional[str], precio_base: float,
               imagenes_url: Optional[str], stock_cantidad: int, disponible: bool) -> Producto:
        producto = Producto(
            nombre=nombre, descripcion=descripcion, precio_base=precio_base,
            imagenes_url=imagenes_url, stock_cantidad=stock_cantidad, disponible=disponible,
        )
        self.session.add(producto)
        self.session.flush()
        return producto

    def add_categoria(self, producto_id: int, categoria_id: int, es_principal: bool = False) -> ProductoCategoria:
        link = ProductoCategoria(
            producto_id=producto_id, categoria_id=categoria_id, es_principal=es_principal
        )
        self.session.add(link)
        self.session.flush()
        return link

    def add_ingrediente(self, producto_id: int, ingrediente_id: int, es_removible: bool = False) -> ProductoIngrediente:
        link = ProductoIngrediente(
            producto_id=producto_id, ingrediente_id=ingrediente_id, es_removible=es_removible
        )
        self.session.add(link)
        self.session.flush()
        return link

    def update(self, id: int, data: "ProductoUpdate") -> Optional[Producto]:
        producto = self.get_by_id(id)
        if not producto:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(producto, key, value)
        self.session.flush()
        return producto

    def soft_delete(self, id: int) -> Optional[Producto]:
        producto = self.get_by_id(id)
        if not producto:
            return None
        producto.disponible = False
        self.session.flush()
        return producto
