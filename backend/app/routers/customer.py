from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.schemas import CustomerCreate, CustomerUpdate, Customer
from app.database import get_db
from app import models
from app.dependencies import get_current_active_user
from app.helpers.lookup import get_customer_or_404



router = APIRouter(
    prefix="/customers",
    tags=["customers"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/", response_model=list[Customer])
def get_customers(
    search: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Customer)

    if search:
        query = query.filter(
            or_(
                models.Customer.name.ilike(f"%{search}%"),
                models.Customer.phone.ilike(f"%{search}%"),
            )
        )

    return query.all()


@router.get("/{customer_id}", response_model=Customer)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = get_customer_or_404(
        db,
        customer_id,
    )

    return customer


@router.post(
    "/",
    response_model=Customer,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(
        name=customer.name,
        phone=customer.phone,
    )

    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)

    return db_customer


@router.put("/{customer_id}", response_model=Customer)
def update_customer(
    customer_id: int,
    updated_customer: CustomerUpdate,
    db: Session = Depends(get_db),
):
    customer = get_customer_or_404(
        db,
        customer_id,
    )

    if updated_customer.name is not None:
        customer.name = updated_customer.name

    if updated_customer.phone is not None:
        customer.phone = updated_customer.phone


    db.commit()
    db.refresh(customer)

    return customer


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = get_customer_or_404(
        db,
        customer_id,
    )


    db.delete(customer)
    db.commit()
    
    return

