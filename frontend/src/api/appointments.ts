import { apiFetch } from "./client";

import type {
    Appointment,
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentStatus,
    AppointmentStatusUpdate,
} from "../types/appointment";



export async function getAppointments(
    date?: string,
    technicianId?: number,
    status?: AppointmentStatus,
    skip: number = 0,
    limit: number = 20
): Promise<Appointment[]> {

    const params = new URLSearchParams();

    if (date) {
        params.append("date", date);
    }

    if (technicianId !== undefined) {
        params.append(
            "technician_id",
            technicianId.toString()
        );
    }

    if (status) {
        params.append("status", status);
    }

    params.append("skip", skip.toString());
    params.append("limit", limit.toString());


    const queryString = params.toString();

    const endpoint = queryString
        ? `/appointments/?${queryString}`
        : "/appointments/";


    const response = await apiFetch(endpoint);


    if (!response.ok) {
        throw new Error(
            "Failed to fetch appointments"
        );
    }


    return response.json();
}


export async function getAppointment(
    id: number
): Promise<Appointment> {

    const response = await apiFetch(
        `/appointments/${id}`
    );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch appointment"
        );
    }


    return response.json();
}


export async function getAvailability(
    technicianId: number,
    serviceId: number,
    date: string,
    excludeAppointmentId?: number
): Promise<string[]> {

    let endpoint =
        `/appointments/availability?technician_id=${technicianId}` +
        `&service_id=${serviceId}` +
        `&date=${encodeURIComponent(date)}`;

    if (excludeAppointmentId !== undefined) {
        endpoint +=
            `&exclude_appointment_id=${excludeAppointmentId}`;
    }

    const response = await apiFetch(endpoint);

    if (!response.ok) {
        throw new Error(
            "Failed to fetch appointment availability"
        );
    }

    return response.json();
}


export async function createAppointment(
    appointment: AppointmentCreate
): Promise<Appointment> {

    const response = await apiFetch(
        "/appointments/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(appointment),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to create appointment"
        );
    }


    return response.json();
}


export async function updateAppointment(
    id: number,
    appointment: AppointmentUpdate
): Promise<Appointment> {

    const response = await apiFetch(
        `/appointments/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(appointment),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update appointment"
        );
    }


    return response.json();
}


export async function deleteAppointment(
    id: number
): Promise<void> {

    const response = await apiFetch(
        `/appointments/${id}`,
        {
            method: "DELETE",
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to delete appointment"
        );
    }
}


export async function updateAppointmentStatus(
    id: number,
    statusUpdate: AppointmentStatusUpdate
): Promise<Appointment> {

    const response = await apiFetch(
        `/appointments/${id}/status`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(statusUpdate),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update appointment status"
        );
    }


    return response.json();
}
