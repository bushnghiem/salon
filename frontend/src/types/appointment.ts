export type AppointmentStatus =
    | "Scheduled"
    | "Confirmed"
    | "Completed"
    | "Cancelled"
    | "No Show";


export interface Appointment {
    id: number;

    customer_id: number;
    technician_id: number;
    service_id: number;

    appointment_time: string;

    status: AppointmentStatus;

    notes: string | null;

    booked_duration: number;
    booked_price: number;
}


export interface AppointmentCreate {
    customer_id: number;
    technician_id: number;
    service_id: number;

    appointment_time: string;

    status?: AppointmentStatus;

    notes?: string | null;
}


export interface AppointmentUpdate {
    customer_id?: number;
    technician_id?: number;
    service_id?: number;

    appointment_time?: string;

    status?: AppointmentStatus;

    notes?: string | null;
}


export interface AppointmentStatusUpdate {
    status: AppointmentStatus;
}


export interface AvailabilityParams {
    technician_id: number;
    service_id: number;
    date: string;
}
