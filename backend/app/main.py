from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app import models
from app.routers import (
    customer,
    technician,
    appointment,
    service,
    dashboard,
    auth,
    users,
)

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer.router)
app.include_router(technician.router)
app.include_router(appointment.router)
app.include_router(service.router)
app.include_router(dashboard.router)
app.include_router(auth.router)
app.include_router(users.router)
