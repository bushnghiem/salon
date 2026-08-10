export type Timeframe =
    | "week"
    | "month"
    | "year";


export interface UpcomingAppointment {

    appointment_id: number;

    customer: string;

    technician: string;

    service: string;

    time: string;
}


export interface PopularService {

    service: string;

    appointments: number;
}


export interface TechnicianWorkload {

    technician: string;

    appointments: number;
}


export interface BusiestDay {

    day: string;

    appointments: number;
}


export interface MonthlyRevenue {
    month: string;
    revenue: number;
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
