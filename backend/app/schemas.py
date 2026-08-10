from pydantic import BaseModel, Field, EmailStr, model_validator
from datetime import datetime
from app.enums import AppointmentStatus, UserRole



class CustomerBase(BaseModel):
    name: str
    phone: str


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None



class Customer(CustomerBase):
    id: int

    class Config:
        from_attributes = True


class TechnicianBase(BaseModel):
    name: str
    phone: str

    work_start: int = Field(
        default=9,
        ge=0,
        le=23,
    )

    work_end: int = Field(
        default=17,
        ge=0,
        le=23,
    )

    @model_validator(mode="after")
    def validate_work_hours(self):
        if self.work_start >= self.work_end:
            raise ValueError(
                "Work start time must be before work end time"
            )

        return self




class TechnicianCreate(TechnicianBase):
    pass


class TechnicianUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None

    work_start: int | None = Field(
        default=None,
        ge=0,
        le=23,
    )

    work_end: int | None = Field(
        default=None,
        ge=0,
        le=23,
    )




class Technician(TechnicianBase):
    id: int

    class Config:
        from_attributes = True


class AppointmentBase(BaseModel):
    customer_id: int
    technician_id: int
    service_id: int
    appointment_time: datetime
    status: AppointmentStatus = AppointmentStatus.SCHEDULED
    notes: str | None = None


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentUpdate(BaseModel):
    customer_id: int | None = None
    technician_id: int | None = None
    service_id: int | None = None
    appointment_time: datetime | None = None
    status: AppointmentStatus | None = None
    notes: str | None = None


class AppointmentStatusUpdate(BaseModel):
    status: AppointmentStatus


class Appointment(AppointmentBase):
    id: int
    booked_duration: int
    booked_price: float

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    name: str
    duration: int = Field(gt=0)
    price: float = Field(ge=0)
    description: str


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: str | None = None
    duration: int | None = None
    price: float | None = None
    description: str | None = None


class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.ADMIN


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: str | None = None
    full_name: str | None = None
    password: str | None = None
    role: UserRole | None = None
    disabled: bool | None = None


class User(UserBase):
    id: int
    disabled: bool

    class Config:
        from_attributes = True


class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str

