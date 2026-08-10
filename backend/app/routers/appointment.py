from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date, datetime, time, timedelta

from app.schemas import AppointmentCreate, AppointmentUpdate, AppointmentStatusUpdate, Appointment
from app.database import get_db
from app.enums import AppointmentStatus
from app import models
from app.dependencies import get_current_active_user
from app.helpers.lookup import (
    get_customer_or_404,
    get_technician_or_404,
    get_service_or_404,
    get_appointment_or_404,
)

def is_technician_available(
    db: Session,
    technician_id: int,
    start_time: datetime,
    duration: int,
    exclude_appointment_id: int | None = None,
) -> bool:
    end_time = start_time + timedelta(minutes=duration)
    technician = get_technician_or_404(db, technician_id)

    work_start = datetime.combine(
        start_time.date(),
        time(hour=technician.work_start)
    )

    work_end = datetime.combine(
        start_time.date(),
        time(hour=technician.work_end)
    )

    if start_time < work_start or end_time > work_end:
        return False

    query = (
        db.query(models.Appointment)
        .filter(models.Appointment.technician_id == technician_id)
    )

    start_of_day = datetime.combine(start_time.date(), time.min)
    end_of_day = datetime.combine(start_time.date(), time.max)

    query = query.filter(
        models.Appointment.appointment_time >= start_of_day,
        models.Appointment.appointment_time <= end_of_day,
    )

    if exclude_appointment_id is not None:
        query = query.filter(
            models.Appointment.id != exclude_appointment_id
        )

    appointments = query.all()

    for appointment in appointments:
        existing_start = appointment.appointment_time
        existing_end = existing_start + timedelta(
            minutes=appointment.booked_duration
        )

        if start_time < existing_end and end_time > existing_start:
            return False

    return True


def check_technician_availability(
    db: Session,
    technician_id: int,
    start_time: datetime,
    duration: int,
    exclude_appointment_id: int | None = None,
):
    if not is_technician_available(
        db=db,
        technician_id=technician_id,
        start_time=start_time,
        duration=duration,
        exclude_appointment_id=exclude_appointment_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Technician is not available during the requested time."
        )

        
router = APIRouter(
    prefix="/appointments",
    tags=["appointments"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("/", response_model=list[Appointment])
def get_appointments(
    date: date | None = None,
    technician_id: int | None = None,
    status: AppointmentStatus | None = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
):
    query = db.query(models.Appointment)

    if technician_id is not None:
        query = query.filter(
            models.Appointment.technician_id == technician_id
        )

    if status is not None:
        query = query.filter(
            models.Appointment.status == status
        )

    if date is not None:
        start = datetime.combine(date, time.min)
        end = datetime.combine(date, time.max)

        query = query.filter(
            models.Appointment.appointment_time >= start,
            models.Appointment.appointment_time <= end,
        )

    return query.offset(skip).limit(limit).all()


@router.get("/availability")
def get_availability(
    technician_id: int,
    service_id: int,
    date: date,
    exclude_appointment_id: int | None = None,
    db: Session = Depends(get_db),
):
    technician = get_technician_or_404(db, technician_id)

    service = get_service_or_404(db, service_id)

    slots = []

    current = datetime.combine(
        date,
        time(hour=technician.work_start)
    )

    end = datetime.combine(
        date,
        time(hour=technician.work_end)
    )

    while current < end:
        slots.append(current)
        current += timedelta(minutes=30)

    available = []

    for slot in slots:
        if is_technician_available(
            db=db,
            technician_id=technician_id,
            start_time=slot,
            duration=service.duration,
            exclude_appointment_id=exclude_appointment_id,
        ):
            available.append(slot.strftime("%H:%M"))


    return available


@router.get("/{appointment_id}", response_model=Appointment)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):

    return get_appointment_or_404(db, appointment_id)


@router.post(
    "/",
    response_model=Appointment,
    status_code=status.HTTP_201_CREATED,
)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    get_customer_or_404(db, appointment.customer_id)
    
    get_technician_or_404(db, appointment.technician_id)

    service = get_service_or_404(db, appointment.service_id)
    
    check_technician_availability(
        db=db,
        technician_id=appointment.technician_id,
        start_time=appointment.appointment_time,
        duration=service.duration,
    )

    db_appointment = models.Appointment(
        customer_id=appointment.customer_id,
        technician_id=appointment.technician_id,
        service_id=service.id,
        appointment_time=appointment.appointment_time,
        booked_duration=service.duration,
        booked_price=service.price,
        status=appointment.status,
        notes=appointment.notes,
    )

    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)

    return db_appointment


@router.put("/{appointment_id}", response_model=Appointment)
def update_appointment(
    appointment_id: int,
    updated_appointment: AppointmentUpdate,
    db: Session = Depends(get_db),
):
    appointment = get_appointment_or_404(db, appointment_id)
    
    if updated_appointment.customer_id is not None:
        get_customer_or_404(db, updated_appointment.customer_id)

    if updated_appointment.technician_id is not None:
        get_technician_or_404(db, updated_appointment.technician_id)

    new_service_id = (
        updated_appointment.service_id
        if updated_appointment.service_id is not None
        else appointment.service_id
    )

    service = get_service_or_404(db, new_service_id)
    
    new_technician_id = (
        updated_appointment.technician_id
        if updated_appointment.technician_id is not None
        else appointment.technician_id
    )

    new_start = (
        updated_appointment.appointment_time
        if updated_appointment.appointment_time is not None
        else appointment.appointment_time
    )

    should_check_availability = any([
        updated_appointment.technician_id is not None,
        updated_appointment.service_id is not None,
        updated_appointment.appointment_time is not None,
    ])

    if should_check_availability:
        check_technician_availability(
            db=db,
            technician_id=new_technician_id,
            start_time=new_start,
            duration=service.duration,
            exclude_appointment_id=appointment_id,
        )

    if updated_appointment.customer_id is not None:
        appointment.customer_id = updated_appointment.customer_id

    if updated_appointment.technician_id is not None:
        appointment.technician_id = updated_appointment.technician_id

    if updated_appointment.appointment_time is not None:
        appointment.appointment_time = updated_appointment.appointment_time

    if updated_appointment.service_id is not None:
        appointment.service_id = service.id
        appointment.booked_duration = service.duration
        appointment.booked_price = service.price

    if updated_appointment.status is not None:
        appointment.status = updated_appointment.status

    if "notes" in updated_appointment.model_fields_set:
        appointment.notes = updated_appointment.notes



    db.commit()
    db.refresh(appointment)

    return appointment


@router.delete(
    "/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
):
    appointment = get_appointment_or_404(db, appointment_id)

    db.delete(appointment)
    db.commit()
    
    return


VALID_TRANSITIONS = {
    AppointmentStatus.SCHEDULED: {
        AppointmentStatus.CONFIRMED,
        AppointmentStatus.CANCELLED,
        AppointmentStatus.NO_SHOW,
    },
    AppointmentStatus.CONFIRMED: {
        AppointmentStatus.COMPLETED,
        AppointmentStatus.CANCELLED,
    },
    AppointmentStatus.COMPLETED: set(),
    AppointmentStatus.CANCELLED: set(),
    AppointmentStatus.NO_SHOW: set(),
}


@router.patch(
    "/{appointment_id}/status",
    response_model=Appointment,
)
def update_appointment_status(
    appointment_id: int,
    status_update: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
):
    appointment = get_appointment_or_404(db, appointment_id)

    if appointment.status == status_update.status:
        return appointment

    if status_update.status not in VALID_TRANSITIONS[appointment.status]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status transition."
        )

    appointment.status = status_update.status
    

    db.commit()
    db.refresh(appointment)

    return appointment




