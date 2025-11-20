from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import httpx

from backend.database import get_db
from backend.models.user import User
from backend.schemas.user import UserCreate, UserResponse, Token
from backend.utils.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from backend.utils.google_oauth import oauth
from backend.config import settings

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user account."""
    # Check if email already exists
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check if username already exists
    if db.query(User).filter(User.username == user_data.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    # Find user by username
    user = db.query(User).filter(User.username == form_data.username).first()

    # Verify user exists and password is correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information."""
    return current_user


@router.get("/google/login")
async def google_login(request: Request):
    """Redirect to Google OAuth login page."""
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback."""
    try:
        # Get the access token from Google
        token = await oauth.google.authorize_access_token(request)

        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info from Google")

        google_id = user_info.get('sub')
        email = user_info.get('email')
        name = user_info.get('name', '')
        picture = user_info.get('picture', '')

        if not email or not google_id:
            raise HTTPException(status_code=400, detail="Email or Google ID not provided")

        # Check if user already exists with this Google ID
        user = db.query(User).filter(User.google_id == google_id).first()

        if not user:
            # Check if user exists with this email (local account)
            user = db.query(User).filter(User.email == email).first()

            if user:
                # Link Google account to existing user
                user.google_id = google_id
                user.profile_picture = picture
                user.auth_provider = "google"
            else:
                # Create new user
                # Generate username from email or name
                username = email.split('@')[0]
                base_username = username
                counter = 1

                # Ensure unique username
                while db.query(User).filter(User.username == username).first():
                    username = f"{base_username}{counter}"
                    counter += 1

                user = User(
                    email=email,
                    username=username,
                    google_id=google_id,
                    profile_picture=picture,
                    auth_provider="google",
                    hashed_password=None
                )
                db.add(user)

            db.commit()
            db.refresh(user)

        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        print(f"DEBUG: Created token for user {user.id} ({user.email}): {access_token[:20]}...")

        # Redirect to frontend with token
        frontend_url = f"{settings.FRONTEND_URL}/auth/callback?token={access_token}"
        print(f"DEBUG: Redirecting to: {frontend_url[:80]}...")
        return RedirectResponse(url=frontend_url)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")
