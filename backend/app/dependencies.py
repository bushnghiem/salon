from typing import Annotated

import jwt

from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from jwt.exceptions import InvalidTokenError

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import oauth2_scheme
from app.config import SECRET_KEY, ALGORITHM


async def get_current_user(
    token: Annotated[
        str,
        Depends(oauth2_scheme),
    ],
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except InvalidTokenError:
        raise credentials_exception

    user = (
        db.query(User)
        .filter(User.id == int(user_id))
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: Annotated[
        User,
        Depends(get_current_user),
    ]
):

    if current_user.disabled:
        raise HTTPException(
            status_code=400,
            detail="Inactive user",
        )

    return current_user
