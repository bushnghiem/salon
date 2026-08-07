from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_active_user
from app.security import get_password_hash
from app.schemas import UserCreate, UserUpdate, User
from app.helpers.lookup import get_user_or_404

from app import models

router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_current_active_user)],
)

@router.get("/me", response_model=User)
def get_current_user(
    current_user: models.User = Depends(get_current_active_user),
):
    return current_user


@router.get("/", response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, db: Session = Depends(get_db)):

    user = get_user_or_404(
        db,
        user_id,
    )

    return user


@router.post(
    "/",
    response_model=User,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    existing = (
        db.query(models.User)
        .filter(models.User.email == user.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=get_password_hash(user.password),
        role=user.role,
    )

    db.add(db_user)

    db.commit()

    db.refresh(db_user)

    return db_user


@router.put("/{user_id}", response_model=User)
def update_user(
    user_id: int,
    updated_user: UserUpdate,
    db: Session = Depends(get_db),
):

    user = get_user_or_404(
        db,
        user_id,
    )



    if updated_user.email is not None:
        existing = (
            db.query(models.User)
            .filter(
                models.User.email == updated_user.email,
                models.User.id != user_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists",
            )
        
        user.email = updated_user.email

    if updated_user.full_name is not None:
        user.full_name = updated_user.full_name

    if updated_user.password is not None:
        user.hashed_password = get_password_hash(
            updated_user.password
        )

    if updated_user.role is not None:
        user.role = updated_user.role

    if updated_user.disabled is not None:
        user.disabled = updated_user.disabled

    db.commit()

    db.refresh(user)

    return user


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = get_user_or_404(
        db,
        user_id,
    )


    user.disabled = True

    db.commit()

    return
