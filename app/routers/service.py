from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.schemas import ServiceCreate, ServiceUpdate, Service
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from app.helpers.lookup import get_service_or_404




router = APIRouter(
    prefix="/services",
    tags=["services"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/", response_model=list[Service])
def get_services(
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Service)

    if search:
        query = query.filter(
            or_(
                models.Service.name.ilike(f"%{search}%"),
                models.Service.description.ilike(f"%{search}%"),
            )
        )

    return query.all()


@router.get("/{service_id}", response_model=Service)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = get_service_or_404(
        db,
        service_id,
    )

    return service


@router.post(
    "/",
    response_model=Service,
    status_code=status.HTTP_201_CREATED,
)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = models.Service(
        name=service.name,
        duration=service.duration,
        price=service.price,
        description=service.description,
    )

    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    return db_service


@router.put("/{service_id}", response_model=Service)
def update_service(
    service_id: int,
    updated_service: ServiceUpdate,
    db: Session = Depends(get_db),
):
    service = get_service_or_404(
        db,
        service_id,
    )

    if updated_service.name is not None:
        service.name = updated_service.name
    
    if updated_service.duration is not None:
        service.duration = updated_service.duration

    if updated_service.price is not None:
        service.price = updated_service.price

    if updated_service.description is not None:
        service.description = updated_service.description



    db.commit()
    db.refresh(service)

    return service


@router.delete(
    "/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = get_service_or_404(
        db,
        service_id,
    )


    db.delete(service)
    db.commit()
    
    return

