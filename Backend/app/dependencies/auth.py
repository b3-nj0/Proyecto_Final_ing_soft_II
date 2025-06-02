from typing import List
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.exc import SQLAlchemyError
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from config.settings_env import settings_objeto as settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    print("Token recibido:", token)
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print("Payload:", payload)  # ver esto en la consola
        return payload
    except JWTError as e:
        print("Error al decodificar:", e)


        raise HTTPException(status_code=401, detail="Token inválido")
    

def solo_admin(current_user: dict = Depends(get_current_user)):
    if current_user["rol"] != "admin":
        raise HTTPException(status_code=403, detail="No tienes permisos de administrador")
    return current_user



def permitir_roles(roles_permitidos: List[str]):
    def role_dependency(user=Depends(get_current_user)):
        try:
            print("DEBUG → Token decodificado:", user)
            rol = user.get("rol")

            if rol not in roles_permitidos:
                print("Rol no permitido:", rol)
                raise HTTPException(status_code=403, detail="No tienes permiso")

            return user

        except SQLAlchemyError as e:
            print("Error de base de datos:", str(e))
            raise HTTPException(status_code=500, detail="Error en base de datos")

        except Exception as e:
            print("Error inesperado:", str(e))
            raise HTTPException(status_code=500, detail="Error inesperado")

    return role_dependency