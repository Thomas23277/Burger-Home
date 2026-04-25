from typing import Optional, List
from sqlmodel import Session, select
from contextlib import contextmanager

from app.models import (
    Categoria, Ingrediente, Producto, ProductoCategoria,
    ProductoIngrediente, Usuario, Pedido, PedidoDetalle
)
from app.schemas import (
    CategoriaCreate, CategoriaUpdate,
    IngredienteCreate, IngredienteUpdate,
    ProductoCreate, ProductoUpdate,
    UsuarioCreate,
    PedidoCreate, PedidoUpdate
)


class Repository:
    def __init__(self, session: Session):
        self.session = session

    # ===== CATEGORÍAS =====
    def get_all_categorias(self) -> List[Categoria]:
        return list(self.session.exec(select(Categoria)).all())

    def get_categoria_by_id(self, id: int) -> Optional[Categoria]:
        return self.session.get(Categoria, id)

    def create_categoria(self, data: CategoriaCreate) -> Categoria:
        categoria = Categoria(**data.model_dump())
        self.session.add(categoria)
        self.session.flush()
        return categoria

    def update_categoria(self, id: int, data: CategoriaUpdate) -> Optional[Categoria]:
        categoria = self.get_categoria_by_id(id)
        if not categoria:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(categoria, key, value)
        self.session.flush()
        return categoria

    def delete_categoria(self, id: int) -> tuple[bool, str]:
        """
        Elimina categoría con lógica inteligente:
        - Si tiene pedidos activos → soft delete (desactiva)
        - Si no tiene pedidos activos → hard delete (borra todo)
        Returns: (success, message)
        """
        categoria = self.get_categoria_by_id(id)
        if not categoria:
            return False, "Categoría no encontrada"
        
        # Verificar si tiene productos
        productos_ids = [pc.producto_id for pc in categoria.productos]
        
        if productos_ids:
            # Verificar si algún producto tiene pedidos activos
            from app.models import Pedido, PedidoDetalle
            from sqlalchemy import select, and_
            
            active_states = ['pendiente', 'confirmado', 'en_preparacion', 'listo']
            
            active_orders = self.session.exec(
                select(Pedido).join(PedidoDetalle).where(
                    and_(
                        PedidoDetalle.producto_id.in_(productos_ids),
                        Pedido.estado.in_(active_states)
                    )
                )
            ).first()
            
            if active_orders:
                # Soft delete: solo desactivar
                categoria.es_activa = False
                self.session.flush()
                return True, "soft_delete"
        
        # Hard delete: borrar todo
        self.session.delete(categoria)
        self.session.flush()
        return True, "hard_delete"

    # ===== INGREDIENTES =====
    def get_all_ingredientes(self) -> List[Ingrediente]:
        return list(self.session.exec(select(Ingrediente)).all())

    def get_ingrediente_by_id(self, id: int) -> Optional[Ingrediente]:
        return self.session.get(Ingrediente, id)

    def create_ingrediente(self, data: IngredienteCreate) -> Ingrediente:
        ingrediente = Ingrediente(**data.model_dump())
        self.session.add(ingrediente)
        self.session.flush()
        return ingrediente

    def update_ingrediente(self, id: int, data: IngredienteUpdate) -> Optional[Ingrediente]:
        ingrediente = self.get_ingrediente_by_id(id)
        if not ingrediente:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(ingrediente, key, value)
        self.session.flush()
        return ingrediente

    def delete_ingrediente(self, id: int) -> tuple[bool, str]:
        """
        Elimina ingrediente con lógica inteligente:
        - Si está en productos con pedidos activos → soft delete (desactiva)
        - Si no tiene pedidos activos → hard delete (borra todo)
        Returns: (success, message)
        """
        ingrediente = self.get_ingrediente_by_id(id)
        if not ingrediente:
            return False, "Ingrediente no encontrado"
        
        productos_ids = [pi.producto_id for pi in ingrediente.productos]
        
        if productos_ids:
            from app.models import Pedido, PedidoDetalle
            from sqlalchemy import select, and_
            
            active_states = ['pendiente', 'confirmado', 'en_preparacion', 'listo']
            
            active_orders = self.session.exec(
                select(Pedido).join(PedidoDetalle).where(
                    and_(
                        PedidoDetalle.producto_id.in_(productos_ids),
                        Pedido.estado.in_(active_states)
                    )
                )
            ).first()
            
            if active_orders:
                ingrediente.disponible = False
                self.session.flush()
                return True, "soft_delete"
        
        self.session.delete(ingrediente)
        self.session.flush()
        return True, "hard_delete"

    # ===== PRODUCTOS =====
    def get_all_productos(self) -> List[Producto]:
        return list(self.session.exec(select(Producto)).all())

    def get_producto_by_id(self, id: int) -> Optional[Producto]:
        return self.session.get(Producto, id)

    def create_producto(self, data: ProductoCreate) -> Producto:
        producto = Producto(
            nombre=data.nombre,
            descripcion=data.descripcion,
            precio_base=data.precio_base,
            imagenes_url=data.imagenes_url,
            stock_cantidad=data.stock_cantidad,
            disponible=data.disponible,
        )
        self.session.add(producto)
        self.session.flush()
        return producto

    def add_categoria(self, producto_id: int, categoria_id: int, es_principal: bool = False) -> ProductoCategoria:
        link = ProductoCategoria(
            producto_id=producto_id,
            categoria_id=categoria_id,
            es_principal=es_principal
        )
        self.session.add(link)
        self.session.flush()
        return link

    def add_ingrediente(self, producto_id: int, ingrediente_id: int, es_removible: bool = False) -> ProductoIngrediente:
        link = ProductoIngrediente(
            producto_id=producto_id,
            ingrediente_id=ingrediente_id,
            es_removible=es_removible
        )
        self.session.add(link)
        self.session.flush()
        return link

    def update_producto(self, id: int, data: ProductoUpdate) -> Optional[Producto]:
        producto = self.get_producto_by_id(id)
        if not producto:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(producto, key, value)
        self.session.flush()
        return producto

    def delete_producto(self, id: int) -> tuple[bool, str]:
        """
        Elimina producto con lógica inteligente:
        - Si tiene pedidos activos → soft delete (marca como no disponible)
        - Si no tiene pedidos activos → hard delete (borra todo)
        Returns: (success, message)
        """
        producto = self.get_producto_by_id(id)
        if not producto:
            return False, "Producto no encontrado"
        
        from app.models import Pedido, PedidoDetalle
        from sqlalchemy import select, and_
        
        active_states = ['pendiente', 'confirmado', 'en_preparacion', 'listo']
        
        active_orders = self.session.exec(
            select(Pedido).join(PedidoDetalle).where(
                and_(
                    PedidoDetalle.producto_id == id,
                    Pedido.estado.in_(active_states)
                )
            )
        ).first()
        
        if active_orders:
            producto.disponible = False
            self.session.flush()
            return True, "soft_delete"
        
        self.session.delete(producto)
        self.session.flush()
        return True, "hard_delete"

    # ===== USUARIOS =====
    def get_all_usuarios(self) -> List[Usuario]:
        return list(self.session.exec(select(Usuario)).all())

    def get_usuario_by_id(self, id: int) -> Optional[Usuario]:
        return self.session.get(Usuario, id)

    def get_usuario_by_username(self, username: str) -> Optional[Usuario]:
        return self.session.exec(select(Usuario).where(Usuario.username == username)).first()

    def create_usuario(self, data: UsuarioCreate, hashed_password: str) -> Usuario:
        usuario = Usuario(
            username=data.username,
            email=data.email,
            nombre=data.nombre,
            rol=data.rol,
            hashed_password=hashed_password
        )
        self.session.add(usuario)
        self.session.flush()
        return usuario

    # ===== PEDIDOS =====
    def get_all_pedidos(self) -> List[Pedido]:
        return list(self.session.exec(select(Pedido)).all())

    def get_pedido_by_id(self, id: int) -> Optional[Pedido]:
        return self.session.get(Pedido, id)

    def create_pedido(self, data: PedidoCreate) -> Pedido:
        total = 0.0
        detalles = []
        
        for detalle in data.detalles:
            producto = self.get_producto_by_id(detalle.producto_id)
            if producto:
                total += producto.precio_base * detalle.cantidad
                detalle_obj = PedidoDetalle(
                    pedido_id=0,
                    producto_id=detalle.producto_id,
                    cantidad=detalle.cantidad,
                    precio_unitario=producto.precio_base,
                    notas=detalle.notas
                )
                detalles.append(detalle_obj)
        
        pedido = Pedido(
            usuario_id=data.usuario_id,
            total=total,
            notas=data.notas
        )
        self.session.add(pedido)
        self.session.flush()
        
        for detalle in detalles:
            detalle.pedido_id = pedido.id
            self.session.add(detalle)
        
        self.session.flush()
        return pedido

    def update_pedido(self, id: int, data: PedidoUpdate) -> Optional[Pedido]:
        pedido = self.get_pedido_by_id(id)
        if not pedido:
            return None
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(pedido, key, value)
        self.session.flush()
        return pedido


class UnitOfWork:
    def __init__(self):
        self.session = None
        self._categorias = None
        self._ingredientes = None
        self._productos = None
        self._usuarios = None
        self._pedidos = None

    def __enter__(self):
        from app.database import engine
        self.session = Session(engine)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            self.session.rollback()
        self.session.close()

    def commit(self):
        if self.session:
            self.session.commit()

    def flush(self):
        if self.session:
            self.session.flush()

    def rollback(self):
        if self.session:
            self.session.rollback()

    def refresh(self, obj):
        if self.session:
            self.session.refresh(obj)

    @property
    def categorias(self) -> Repository:
        if self._categorias is None:
            self._categorias = Repository(self.session)
        return self._categorias

    @property
    def ingredientes(self) -> Repository:
        if self._ingredientes is None:
            self._ingredientes = Repository(self.session)
        return self._ingredientes

    @property
    def productos(self) -> Repository:
        if self._productos is None:
            self._productos = Repository(self.session)
        return self._productos

    @property
    def usuarios(self) -> Repository:
        if self._usuarios is None:
            self._usuarios = Repository(self.session)
        return self._usuarios

    @property
    def pedidos(self) -> Repository:
        if self._pedidos is None:
            self._pedidos = Repository(self.session)
        return self._pedidos