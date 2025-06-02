from typing import List
from fastapi import Depends, HTTPException, Request
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session


from dependencies.auth import get_current_user
from config.settings_env import settings_objeto as settings
from config.database import get_db
from models.model_user import Usuario
from schemas.schema_user import UsuarioBase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def autenticar_usuario(db: Session, username: str, password: str):
    usuario = db.query(Usuario).filter(Usuario.user == username).first()
    if not usuario:
        return None
    if not verify_password(password, usuario.contrasena):
        return None
    return usuario

def crear_token_acceso(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    token = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token

# usuario = autenticar_usuario(db, username="admin", password="1234")
# if not usuario:
#     raise HTTPException(status_code=401, detail="Credenciales inválidas")
# token = crear_token_acceso({
#     "sub": usuario.usuario,
#     "rol": usuario.rol,
#     "id_usuario": usuario.id_usuario
# })


def crear_usuario(db: Session, usuario_in: UsuarioBase):
    usuario_existente = db.query(Usuario).filter(Usuario.user == usuario_in.user).first()
    if usuario_existente:
        raise ValueError("El user de usuario ya está registrado")

    nuevo_usuario = Usuario(
        nombre=usuario_in.nombre,
        telefono=usuario_in.telefono,
        direccion=usuario_in.direccion,
        user=usuario_in.user,
        contrasena=get_password_hash(usuario_in.contrasena),
        rol=usuario_in.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

