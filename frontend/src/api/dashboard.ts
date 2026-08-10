import { apiFetch } from "./client";
import type { DashboardData } from "../types/dashboard";


export interface MonthlyRevenue {
    month: string;
    revenue: number;
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


export interface AverageAppointment {
    average_appointment: number;
}


export async function getDashboard(): Promise<DashboardData> {

    const response =
        await apiFetch("/dashboard/");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch dashboard"
        );
    }

    return response.json();
}


export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {

    const response =
        await apiFetch("/dashboard/revenue");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch monthly revenue"
        );
    }

    return response.json();
}


export async function getPopularServices(): Promise<PopularService[]> {

    const response =
        await apiFetch("/dashboard/popular-services");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch popular services"
        );
    }

    return response.json();
}


export async function getTechnicianWorkload(): Promise<TechnicianWorkload[]> {

    const response =
        await apiFetch("/dashboard/technician-workload");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch technician workload"
        );
    }

    return response.json();
}


export async function getBusiestDays(): Promise<BusiestDay[]> {

    const response =
        await apiFetch("/dashboard/busiest-days");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch busiest days"
        );
    }

    return response.json();
}


export async function getAverageAppointment(): Promise<AverageAppointment> {

    const response =
        await apiFetch("/dashboard/average-appointment");

    if (!response.ok) {
        throw new Error(
            "Failed to fetch average appointment"
        );
    }

    return response.json();
}