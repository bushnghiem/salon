from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app import models


def get_customer_or_404(
    db: Session,
    customer_id: int,
) -> models.Customer:

    customer = (
        db.query(models.Customer)
        .filter(models.Customer.id == customer_id)
        .first()
    )

    if customer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    return customer



def get_technician_or_404(
    db: Session,
    technician_id: int,
) -> models.Technician:

    technician = (
        db.query(models.Technician)
        .filter(models.Technician.id == technician_id)
        .first()
    )

    if technician is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technician not found",
        )

    return technician



def get_service_or_404(
    db: Session,
    service_id: int,
) -> models.Service:

    service = (
        db.query(models.Service)
        .filter(models.Service.id == service_id)
        .first()
    )

    if service is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service


def get_appointment_or_404(db: Session, appointment_id: int) -> models.Appointment:
    appointment = (
        db.query(models.Appointment)
        .filter(models.Appointment.id == appointment_id)
        .first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found",
        )

    return appointment


def get_user_or_404(
    db: Session,
    user_id: int,
) -> models.User:

    user = (
        db.query(models.User)
        .filter(models.User.id == user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
