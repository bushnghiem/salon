from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.schemas import TechnicianCreate, TechnicianUpdate, Technician
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from app.helpers.lookup import get_technician_or_404


router = APIRouter(
    prefix="/technicians",
    tags=["technicians"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/", response_model=list[Technician])
def get_technicians(
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Technician)

    if search:
        query = query.filter(
            or_(
                models.Technician.name.ilike(f"%{search}%"),
                models.Technician.phone.ilike(f"%{search}%"),
            )
        )

    return query.all()


@router.get("/{technician_id}", response_model=Technician)
def get_technician(technician_id: int, db: Session = Depends(get_db)):
    technician = get_technician_or_404(
        db,
        technician_id,
    )
    
    return technician


@router.post(
        "/",
        response_model=Technician,
        status_code=status.HTTP_201_CREATED
)
def create_technician(technician: TechnicianCreate, db: Session = Depends(get_db)):
    db_technician = models.Technician(
        name=technician.name,
        phone=technician.phone,
        work_start=technician.work_start,
        work_end=technician.work_end,
    )


    db.add(db_technician)
    db.commit()
    db.refresh(db_technician)

    return db_technician


@router.put("/{technician_id}", response_model=Technician)
def update_technician(
    technician_id: int,
    updated_technician: TechnicianUpdate,
    db: Session = Depends(get_db)
    ):
    technician = get_technician_or_404(
        db,
        technician_id,
    )
    
    new_work_start = (
        updated_technician.work_start
        if updated_technician.work_start is not None
        else technician.work_start
    )

    new_work_end = (
        updated_technician.work_end
        if updated_technician.work_end is not None
        else technician.work_end
    )

    if new_work_start >= new_work_end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Work start time must be before work end time.",
        )


    if updated_technician.name is not None:
        technician.name = updated_technician.name
    
    if updated_technician.phone is not None:
        technician.phone = updated_technician.phone
    
    if updated_technician.work_start is not None:
        technician.work_start = updated_technician.work_start

    if updated_technician.work_end is not None:
        technician.work_end = updated_technician.work_end


    db.commit()
    db.refresh(technician)

    return technician


@router.delete(
    "/{technician_id}",
    status_code=status.HTTP_204_NO_CONTENT)
def delete_technician(
    technician_id: int,
    db: Session = Depends(get_db)
):
    technician = get_technician_or_404(
        db,
        technician_id,
    )

    db.delete(technician)
    db.commit()
    
    return
