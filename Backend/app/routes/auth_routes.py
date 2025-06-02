from fastapi import APIRouter, Request, Form, Depends, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from starlette.middleware.sessions import SessionMiddleware  
from passlib.context import CryptContext
from jose import jwt

from dependencies.auth import get_current_user
from config.database import get_db
from config.settings_env import settings_objeto as settings

from schemas.schema_user import UsuarioBase, UsuarioLogin, TokenResponse
from schemas.usuario_schemas import UsuarioActual

from service.service_auth import autenticar_usuario, crear_usuario, crear_token_acceso

from sqlalchemy.orm import Session

from models.model_user import Usuario as User

usuario = APIRouter(tags=["User"])


# Autenticación con DB


@usuario.get("/me", response_model=UsuarioActual)
def obtener_mi_perfil(user=Depends(get_current_user)):
    print('que esta devolviendo ' + user)
    return user


@usuario.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = autenticar_usuario(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Usuario o contraseña incorrectos")


    token_data = {
        "usuario": user.user,
        "rol": user.rol,
        "id_usuario": user.id_usuario
    }


    access_token = crear_token_acceso(token_data)


    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@usuario.post("/registro", status_code=201)
def registrar_usuario(usuario_in: UsuarioBase, db: Session = Depends(get_db)):
    try:
        nuevo_usuario = crear_usuario(db, usuario_in)
        return {"mensaje": "Usuario creado correctamente", "id_usuario": nuevo_usuario.id_usuario}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Error interno al crear usuario")



@usuario.post("/logout")
def logout():
    """
    No hace nada a nivel de backend porque JWT es stateless.
    El frontend debe borrar el token en localStorage/sessionStorage.
    """
    return {"message": "Sesión cerrada correctamente"}
