from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Enum, Boolean
from app.enums import AppointmentStatus, UserRole
from sqlalchemy.orm import relationship
from app.database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)

    appointments = relationship(
        "Appointment",
        back_populates="customer"
    )

class Technician(Base):
    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    work_start = Column(Integer, nullable=False, default=9)
    work_end = Column(Integer, nullable=False, default=17)

    appointments = relationship(
        "Appointment",
        back_populates="technician"
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False,
    )

    technician_id = Column(
        Integer,
        ForeignKey("technicians.id"),
        nullable=False,
    )

    service_id = Column(
        Integer,
        ForeignKey("services.id"),
        nullable=False,
    )

    appointment_time = Column(DateTime, nullable=False)

    booked_duration = Column(Integer, nullable=False)

    booked_price = Column(Float, nullable=False)

    status = Column(
        Enum(AppointmentStatus),
        default=AppointmentStatus.SCHEDULED,
        nullable=False,
    )

    notes = Column(String)

    customer = relationship(
        "Customer",
        back_populates="appointments",
    )

    technician = relationship(
        "Technician",
        back_populates="appointments",
    )

    service = relationship(
        "Service",
        back_populates="appointments",
    )


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=False)

    appointments = relationship(
        "Appointment",
        back_populates="service",
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, nullable=False)

    full_name = Column(String, nullable=False)

    hashed_password = Column(String, nullable=False)

    role = Column(Enum(UserRole), nullable=False, default=UserRole.ADMIN,)

    disabled = Column(Boolean, default=False, nullable=False)
