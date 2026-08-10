from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date, datetime, time, timedelta
from typing import Literal

from app.database import get_db
from app.enums import AppointmentStatus
from app import models
from app.dependencies import get_current_active_user


router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard"],
    dependencies=[Depends(get_current_active_user)],
)


Timeframe = Literal["week", "month", "year"]


def get_timeframe_range(timeframe: Timeframe):
    """
    Returns the start and end datetime for the requested timeframe.

    week  = Monday through today
    month = first day of current month through today
    year  = January 1 through today
    """

    today = date.today()

    if timeframe == "week":

        start_date = today - timedelta(
            days=today.weekday()
        )

    elif timeframe == "month":

        start_date = today.replace(
            day=1
        )

    else:

        start_date = today.replace(
            month=1,
            day=1
        )

    start = datetime.combine(
        start_date,
        time.min
    )

    end = datetime.combine(
        today + timedelta(days=1),
        time.min
    )

    return start, end


@router.get("/")
def get_dashboard(
    db: Session = Depends(get_db)
):

    today = date.today()

    start = datetime.combine(
        today,
        time.min
    )

    end = datetime.combine(
        today + timedelta(days=1),
        time.min
    )


    appointments_today = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.appointment_time >= start,
            models.Appointment.appointment_time < end,
        )
        .count()
    )


    scheduled = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.status ==
            AppointmentStatus.SCHEDULED
        )
        .count()
    )


    confirmed = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.status ==
            AppointmentStatus.CONFIRMED
        )
        .count()
    )


    completed = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.status ==
            AppointmentStatus.COMPLETED
        )
        .count()
    )


    cancelled = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.status ==
            AppointmentStatus.CANCELLED
        )
        .count()
    )


    no_show = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.status ==
            AppointmentStatus.NO_SHOW
        )
        .count()
    )


    revenue_today = (
        db.query(
            func.sum(
                models.Appointment.booked_price
            )
        )
        .filter(
            models.Appointment.status ==
            AppointmentStatus.COMPLETED,

            models.Appointment.appointment_time >= start,

            models.Appointment.appointment_time < end,
        )
        .scalar()
        or 0
    )


    customer_count = (
        db.query(models.Customer)
        .count()
    )


    technician_count = (
        db.query(models.Technician)
        .count()
    )


    upcoming = (
        db.query(models.Appointment)
        .filter(
            models.Appointment.appointment_time >=
            datetime.now(),

            models.Appointment.status !=
            AppointmentStatus.CANCELLED,
        )
        .order_by(
            models.Appointment.appointment_time
        )
        .limit(5)
        .all()
    )


    return {
        "today": {
            "appointments": appointments_today,
        },

        "status": {
            "scheduled": scheduled,
            "confirmed": confirmed,
            "completed": completed,
            "cancelled": cancelled,
            "no_show": no_show,
        },

        "revenue": {
            "today": revenue_today,
        },

        "customers": customer_count,

        "technicians": technician_count,

        "upcoming": [
            {
                "appointment_id": appointment.id,
                "customer": appointment.customer.name,
                "technician": appointment.technician.name,
                "service": appointment.service.name,
                "time": appointment.appointment_time,
            }
            for appointment in upcoming
        ],
    }


@router.get("/revenue")
def get_monthly_revenue(db: Session = Depends(get_db)):
    revenue = (
        db.query(
            extract(
                "year",
                models.Appointment.appointment_time
            ).label("year"),

            extract(
                "month",
                models.Appointment.appointment_time
            ).label("month"),

            func.sum(
                models.Appointment.booked_price
            ).label("revenue"),
        )
        .filter(
            models.Appointment.status ==
            AppointmentStatus.COMPLETED
        )
        .group_by(
            extract(
                "year",
                models.Appointment.appointment_time
            ),

            extract(
                "month",
                models.Appointment.appointment_time
            ),
        )
        .order_by(
            extract(
                "year",
                models.Appointment.appointment_time
            ),

            extract(
                "month",
                models.Appointment.appointment_time
            ),
        )
        .all()
    )

    return [
        {
            "month":
                f"{int(row.year)}-{int(row.month):02}",

            "revenue":
                float(row.revenue or 0),
        }

        for row in revenue
    ]



@router.get("/popular-services")
def get_popular_services(
    timeframe: Timeframe = Query(
        "month"
    ),
    db: Session = Depends(get_db),
):

    start, end = get_timeframe_range(
        timeframe
    )


    services = (
        db.query(
            models.Service.name,

            func.count(
                models.Appointment.id
            ).label("appointments"),
        )
        .join(
            models.Appointment,
            models.Service.id ==
            models.Appointment.service_id,
        )
        .filter(
            models.Appointment.appointment_time >= start,
            models.Appointment.appointment_time < end,
        )
        .group_by(
            models.Service.id
        )
        .order_by(
            func.count(
                models.Appointment.id
            ).desc()
        )
        .all()
    )


    return [
        {
            "service": row.name,
            "appointments": row.appointments,
        }
        for row in services
    ]


@router.get("/technician-workload")
def get_technician_workload(
    timeframe: Timeframe = Query(
        "month"
    ),
    db: Session = Depends(get_db),
):

    start, end = get_timeframe_range(
        timeframe
    )


    workload = (
        db.query(
            models.Technician.name,

            func.count(
                models.Appointment.id
            ).label("appointments"),
        )
        .join(
            models.Appointment,
            models.Technician.id ==
            models.Appointment.technician_id,
        )
        .filter(
            models.Appointment.appointment_time >= start,
            models.Appointment.appointment_time < end,
        )
        .group_by(
            models.Technician.id
        )
        .order_by(
            func.count(
                models.Appointment.id
            ).desc()
        )
        .all()
    )


    return [
        {
            "technician": row.name,
            "appointments": row.appointments,
        }
        for row in workload
    ]


@router.get("/busiest-days")
def get_busiest_days(
    timeframe: Timeframe = Query(
        "month"
    ),
    db: Session = Depends(get_db),
):

    start, end = get_timeframe_range(
        timeframe
    )


    days = (
        db.query(
            extract(
                "dow",
                models.Appointment.appointment_time
            ).label("day"),

            func.count(
                models.Appointment.id
            ).label("appointments"),
        )
        .filter(
            models.Appointment.appointment_time >= start,
            models.Appointment.appointment_time < end,
        )
        .group_by(
            extract(
                "dow",
                models.Appointment.appointment_time
            )
        )
        .order_by(
            func.count(
                models.Appointment.id
            ).desc()
        )
        .all()
    )


    day_names = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
    }


    return [
        {
            "day": day_names[int(row.day)],
            "appointments": row.appointments,
        }
        for row in days
    ]


@router.get("/average-appointment")
def get_average_appointment(
    db: Session = Depends(get_db)
):

    average = (
        db.query(
            func.avg(
                models.Appointment.booked_price
            )
        )
        .filter(
            models.Appointment.status ==
            AppointmentStatus.COMPLETED
        )
        .scalar()
    )


    return {
        "average_appointment": round(
            average or 0,
            2
        )
    }
