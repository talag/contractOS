from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models.user import User

# JWT Configuration
SECRET_KEY = "your-secret-key-change-this-in-production"  # TODO: Move to environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Get the current authenticated user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        print(f"DEBUG: Received token: {token[:20]}..." if len(token) > 20 else f"DEBUG: Received token: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG: Decoded payload: {payload}")
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            print("DEBUG: No user_id in payload")
            raise credentials_exception
        user_id = int(user_id_str)
    except JWTError as e:
        print(f"DEBUG: JWT decode error: {e}")
        raise credentials_exception
    except (ValueError, TypeError) as e:
        print(f"DEBUG: Invalid user_id format: {e}")
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        print(f"DEBUG: User not found with id: {user_id}")
        raise credentials_exception

    print(f"DEBUG: User authenticated: {user.email}")
    return user
