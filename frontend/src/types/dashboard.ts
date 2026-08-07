export interface UpcomingAppointment {
    appointment_id: number;
    customer: string;
    technician: string;
    service: string;
    time: string;
}


export interface DashboardData {

    today: {
        appointments: number;
    };

    status: {
        scheduled: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        no_show: number;
    };

    revenue: {
        today: number;
    };

    customers: number;

    technicians: number;

    upcoming: UpcomingAppointment[];
}
