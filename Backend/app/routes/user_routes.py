from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from config.database import get_db

from service.service_auth import crear_usuario

from schemas.schema_user import UsuarioBase
from schemas.usuario_schemas import UsuarioActual
from dependencies.auth import get_current_user, permitir_roles

user_route = APIRouter(prefix="/auth", tags=["auth"])


@user_route.get("/me", response_model=UsuarioActual)
def obtener_mi_perfil(user=Depends(get_current_user)):
    print('que esta devolviendo ' + user)
    return user

