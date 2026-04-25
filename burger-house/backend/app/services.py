from typing import List, Optional
from fastapi import HTTPException, status
from app.models import Categoria, Ingrediente, Producto
from app.schemas import (
    CategoriaCreate, CategoriaUpdate, CategoriaResponse,
    IngredienteCreate, IngredienteUpdate, IngredienteResponse,
    ProductoCreate, ProductoUpdate, ProductoResponse,
    UsuarioCreate, UsuarioResponse,
    PedidoCreate, PedidoUpdate, PedidoResponse
)
from app.repository import UnitOfWork


def _build_categoria_response(categoria: Categoria, uow: UnitOfWork) -> CategoriaResponse:
    return CategoriaResponse(
        id=categoria.id,
        nombre=categoria.nombre,
        descripcion=categoria.descripcion,
        imagen_url=categoria.imagen_url,
        es_activa=categoria.es_activa,
    )


def _build_ingrediente_response(ingrediente: Ingrediente, uow: UnitOfWork) -> IngredienteResponse:
    return IngredienteResponse(
        id=ingrediente.id,
        nombre=ingrediente.nombre,
        descripcion=ingrediente.descripcion,
        precio_adicional=ingrediente.precio_adicional,
        imagen_url=ingrediente.imagen_url,
        disponible=ingrediente.disponible,
    )


def _build_producto_response(producto: Producto, uow: UnitOfWork) -> ProductoResponse:
    categorias = []
    if producto.categorias:
        for pc in producto.categorias:
            if pc.categoria:
                categorias.append({
                    "id": pc.categoria.id,
                    "nombre": pc.categoria.nombre,
                    "imagen_url": pc.categoria.imagen_url,
                    "es_principal": pc.es_principal
                })

    ingredientes = []
    if producto.ingredientes:
        for pi in producto.ingredientes:
            if pi.ingrediente:
                ingredientes.append({
                    "id": pi.ingrediente.id,
                    "nombre": pi.ingrediente.nombre,
                    "precio_adicional": pi.ingrediente.precio_adicional,
                    "imagen_url": pi.ingrediente.imagen_url
                })

    return ProductoResponse(
        id=producto.id,
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio_base=producto.precio_base,
        imagenes_url=producto.imagenes_url,
        stock_cantidad=producto.stock_cantidad,
        disponible=producto.disponible,
        created_at=producto.created_at,
        updated_at=producto.updated_at,
        categorias=categorias,
        ingredientes=ingredientes,
    )


# ===== SERVICIOS DE CATEGORÍAS =====

def get_all_categorias() -> List[CategoriaResponse]:
    with UnitOfWork() as uow:
        categorias = uow.categorias.get_all_categorias()
        return [_build_categoria_response(c, uow) for c in categorias]


def get_categoria_by_id(id: int) -> CategoriaResponse:
    with UnitOfWork() as uow:
        categoria = uow.categorias.get_categoria_by_id(id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        return _build_categoria_response(categoria, uow)


def create_categoria(data: CategoriaCreate) -> CategoriaResponse:
    with UnitOfWork() as uow:
        categoria = uow.categorias.create_categoria(data)
        uow.commit()
        return _build_categoria_response(categoria, uow)


def update_categoria(id: int, data: CategoriaUpdate) -> CategoriaResponse:
    with UnitOfWork() as uow:
        categoria = uow.categorias.update_categoria(id, data)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        uow.commit()
        return _build_categoria_response(categoria, uow)


def delete_categoria(id: int) -> dict:
    with UnitOfWork() as uow:
        success, message = uow.categorias.delete_categoria(id)
        if not success:
            raise HTTPException(status_code=404, detail=message)
        uow.commit()
        
        if message == "soft_delete":
            return {"message": "Categoría desactivada (tiene pedidos activos)", "type": "soft_delete"}
        else:
            return {"message": "Categoría eliminada correctamente", "type": "hard_delete"}


# ===== SERVICIOS DE INGREDIENTES =====

def get_all_ingredientes() -> List[IngredienteResponse]:
    with UnitOfWork() as uow:
        ingredientes = uow.ingredientes.get_all_ingredientes()
        return [_build_ingrediente_response(i, uow) for i in ingredientes]


def get_ingrediente_by_id(id: int) -> IngredienteResponse:
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.get_ingrediente_by_id(id)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        return _build_ingrediente_response(ingrediente, uow)


def create_ingrediente(data: IngredienteCreate) -> IngredienteResponse:
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.create_ingrediente(data)
        uow.commit()
        return _build_ingrediente_response(ingrediente, uow)


def update_ingrediente(id: int, data: IngredienteUpdate) -> IngredienteResponse:
    with UnitOfWork() as uow:
        ingrediente = uow.ingredientes.update_ingrediente(id, data)
        if not ingrediente:
            raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
        uow.commit()
        return _build_ingrediente_response(ingrediente, uow)


def delete_ingrediente(id: int) -> dict:
    with UnitOfWork() as uow:
        success, message = uow.ingredientes.delete_ingrediente(id)
        if not success:
            raise HTTPException(status_code=404, detail=message)
        uow.commit()
        
        if message == "soft_delete":
            return {"message": "Ingrediente desactivado (está en productos con pedidos activos)", "type": "soft_delete"}
        else:
            return {"message": "Ingrediente eliminado correctamente", "type": "hard_delete"}


# ===== SERVICIOS DE PRODUCTOS =====

def get_all_productos() -> List[ProductoResponse]:
    with UnitOfWork() as uow:
        productos = uow.productos.get_all_productos()
        return [_build_producto_response(p, uow) for p in productos]


def get_producto_by_id(id: int) -> ProductoResponse:
    with UnitOfWork() as uow:
        producto = uow.productos.get_producto_by_id(id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return _build_producto_response(producto, uow)


def create_producto(data: ProductoCreate) -> ProductoResponse:
    with UnitOfWork() as uow:
        producto = Producto(
            nombre=data.nombre,
            descripcion=data.descripcion,
            precio_base=data.precio_base,
            imagenes_url=data.imagenes_url,
            stock_cantidad=data.stock_cantidad,
            disponible=data.disponible,
        )
        uow.session.add(producto)
        uow.session.flush()

        principales = [c for c in data.categorias if c.es_principal]
        if len(principales) > 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Solo puede haber una categoría principal por producto"
            )

        for cat_input in data.categorias:
            cat = uow.categorias.get_categoria_by_id(cat_input.categoria_id)
            if not cat:
                raise HTTPException(status_code=404, detail=f"Categoría {cat_input.categoria_id} no encontrada")
            uow.productos.add_categoria(producto.id, cat_input.categoria_id, cat_input.es_principal)

        for ing_input in data.ingredientes:
            ing = uow.ingredientes.get_ingrediente_by_id(ing_input.ingrediente_id)
            if not ing:
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_input.ingrediente_id} no encontrado")
            uow.productos.add_ingrediente(producto.id, ing_input.ingrediente_id, ing_input.es_removible)

        uow.commit()
        uow.refresh(producto)
        _ = producto.categorias
        _ = producto.ingredientes
        return _build_producto_response(producto, uow)


def update_producto(id: int, data: ProductoUpdate) -> ProductoResponse:
    with UnitOfWork() as uow:
        producto = uow.productos.update_producto(id, data)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        uow.commit()
        return _build_producto_response(producto, uow)


def delete_producto(id: int) -> dict:
    with UnitOfWork() as uow:
        success, message = uow.productos.delete_producto(id)
        if not success:
            raise HTTPException(status_code=404, detail=message)
        uow.commit()
        
        if message == "soft_delete":
            return {"message": "Producto marcado como no disponible (tiene pedidos activos)", "type": "soft_delete"}
        else:
            return {"message": "Producto eliminado correctamente", "type": "hard_delete"}


# ===== SERVICIOS DE USUARIOS =====

def get_all_usuarios() -> List[UsuarioResponse]:
    with UnitOfWork() as uow:
        usuarios = uow.usuarios.get_all_usuarios()
        return [UsuarioResponse(
            id=u.id,
            username=u.username,
            email=u.email,
            nombre=u.nombre,
            rol=u.rol,
            created_at=u.created_at
        ) for u in usuarios]


def create_usuario(data: UsuarioCreate) -> UsuarioResponse:
    with UnitOfWork() as uow:
        existing = uow.usuarios.get_usuario_by_username(data.username)
        if existing:
            raise HTTPException(status_code=400, detail="El username ya existe")
        
        hashed_password = f"hashed_{data.password}"
        usuario = uow.usuarios.create_usuario(data, hashed_password)
        uow.commit()
        
        return UsuarioResponse(
            id=usuario.id,
            username=usuario.username,
            email=usuario.email,
            nombre=usuario.nombre,
            rol=usuario.rol,
            created_at=usuario.created_at
        )


# ===== SERVICIOS DE PEDIDOS =====

def get_all_pedidos() -> List[PedidoResponse]:
    with UnitOfWork() as uow:
        pedidos = uow.pedidos.get_all_pedidos()
        return [PedidoResponse(
            id=p.id,
            usuario_id=p.usuario_id,
            estado=p.estado,
            total=p.total,
            notas=p.notas,
            created_at=p.created_at,
            updated_at=p.updated_at,
            detalles=[]
        ) for p in pedidos]


def get_pedido_by_id(id: int) -> PedidoResponse:
    with UnitOfWork() as uow:
        pedido = uow.pedidos.get_pedido_by_id(id)
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        return PedidoResponse(
            id=pedido.id,
            usuario_id=pedido.usuario_id,
            estado=pedido.estado,
            total=pedido.total,
            notas=pedido.notas,
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
            detalles=[]
        )


def create_pedido(data: PedidoCreate) -> PedidoResponse:
    with UnitOfWork() as uow:
        usuario = uow.usuarios.get_usuario_by_id(data.usuario_id)
        if not usuario:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        pedido = uow.pedidos.create_pedido(data)
        uow.commit()
        
        return PedidoResponse(
            id=pedido.id,
            usuario_id=pedido.usuario_id,
            estado=pedido.estado,
            total=pedido.total,
            notas=pedido.notas,
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
            detalles=[]
        )


def update_pedido(id: int, data: PedidoUpdate) -> PedidoResponse:
    with UnitOfWork() as uow:
        pedido = uow.pedidos.update_pedido(id, data)
        if not pedido:
            raise HTTPException(status_code=404, detail="Pedido no encontrado")
        uow.commit()
        return PedidoResponse(
            id=pedido.id,
            usuario_id=pedido.usuario_id,
            estado=pedido.estado,
            total=pedido.total,
            notas=pedido.notas,
            created_at=pedido.created_at,
            updated_at=pedido.updated_at,
            detalles=[]
        )