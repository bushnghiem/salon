from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import (
    verify_password,
    create_access_token,
)
from app.config import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

from fastapi.security import OAuth2PasswordRequestForm
from app.security import get_password_hash
from app.enums import UserRole
from app import models
from app.schemas import Token, RegisterRequest, User



router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
)


@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    email = form_data.username
    
    user = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )


    if (
        user is None
        or not verify_password(
            form_data.password,
            user.hashed_password,
        )
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


    token = create_access_token(
        {
            "sub": str(user.id)
        },
        timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )

    return Token(
        access_token=token,
        token_type="bearer",
    )


@router.post(
    "/register",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db),
):
    email = user.email.lower()

    existing_user = (
        db.query(models.User)
        .filter(models.User.email == email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    db_user = models.User(
        email=email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        role=UserRole.RECEPTIONIST,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

