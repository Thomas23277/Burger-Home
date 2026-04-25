from typing import Optional, List, Annotated
from pydantic import BaseModel, Field
from fastapi import Query
from datetime import datetime


# Schemas con Annotated para validaciones
class PaginationParams:
    def __init__(
        skip: Annotated[int, Query(ge=0, description="Registros a saltar")] = 0,
        limit: Annotated[int, Query(ge=1, le=100, description="Cantidad máxima")] = 10
    ):
        self.skip = skip
        self.limit = limit


class CategoriaBase(BaseModel):
    nombre: Annotated[str, Field(min_length=1, max_length=100, description="Nombre de la categoría")]
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    es_activa: bool = True


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    es_activa: Optional[bool] = None


class CategoriaResponse(CategoriaBase):
    id: int

    class Config:
        from_attributes = True


class IngredienteBase(BaseModel):
    nombre: str = Field(max_length=100)
    descripcion: Optional[str] = None
    precio_adicional: float = 0.0
    imagen_url: Optional[str] = None
    disponible: bool = True


class IngredienteCreate(IngredienteBase):
    pass


class IngredienteUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_adicional: Optional[float] = None
    imagen_url: Optional[str] = None
    disponible: Optional[bool] = None


class IngredienteResponse(IngredienteBase):
    id: int

    class Config:
        from_attributes = True


class CategoriaInput(BaseModel):
    categoria_id: int
    es_principal: bool = False


class IngredienteInput(BaseModel):
    ingrediente_id: int
    es_removible: bool = False


class ProductoBase(BaseModel):
    nombre: str = Field(max_length=200)
    descripcion: Optional[str] = None
    precio_base: float
    imagenes_url: Optional[str] = None
    stock_cantidad: int = 0
    disponible: bool = True


class ProductoCreate(ProductoBase):
    categorias: List[CategoriaInput] = []
    ingredientes: List[IngredienteInput] = []


class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[float] = None
    imagenes_url: Optional[str] = None
    stock_cantidad: Optional[int] = None
    disponible: Optional[bool] = None


class CategoriaNestedResponse(BaseModel):
    id: int
    nombre: str
    imagen_url: Optional[str] = None
    es_principal: bool

    class Config:
        from_attributes = True


class IngredienteNestedResponse(BaseModel):
    id: int
    nombre: str
    precio_adicional: float
    imagen_url: Optional[str] = None

    class Config:
        from_attributes = True


class ProductoResponse(ProductoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    categorias: List[CategoriaNestedResponse] = []
    ingredientes: List[IngredienteNestedResponse] = []

    class Config:
        from_attributes = True


class UsuarioBase(BaseModel):
    username: str = Field(max_length=100)
    email: str = Field(max_length=200)
    nombre: str
    rol: str = "cliente"


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioResponse(UsuarioBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class PedidoDetalleBase(BaseModel):
    producto_id: int
    cantidad: int = 1
    notas: Optional[str] = None


class PedidoDetalleCreate(PedidoDetalleBase):
    pass


class PedidoDetalleResponse(PedidoDetalleBase):
    id: int
    precio_unitario: float

    class Config:
        from_attributes = True


class PedidoBase(BaseModel):
    notas: Optional[str] = None


class PedidoCreate(PedidoBase):
    usuario_id: int
    detalles: List[PedidoDetalleCreate] = []


class PedidoUpdate(BaseModel):
    estado: Optional[str] = None
    notas: Optional[str] = None


class PedidoResponse(PedidoBase):
    id: int
    usuario_id: int
    estado: str
    total: float
    created_at: datetime
    updated_at: datetime
    detalles: List[PedidoDetalleResponse] = []

    class Config:
        from_attributes = True