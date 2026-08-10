import { apiFetch } from "./client";

import type {
    DashboardData,
    PopularService,
    TechnicianWorkload,
    BusiestDay,
    Timeframe,
    MonthlyRevenue,
} from "../types/dashboard";


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


export async function getPopularServices(
    timeframe: Timeframe
): Promise<PopularService[]> {

    const response =
        await apiFetch(
            `/dashboard/popular-services?timeframe=${timeframe}`
        );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch popular services"
        );
    }


    return response.json();
}


export async function getTechnicianWorkload(
    timeframe: Timeframe
): Promise<TechnicianWorkload[]> {

    const response =
        await apiFetch(
            `/dashboard/technician-workload?timeframe=${timeframe}`
        );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch technician workload"
        );
    }


    return response.json();
}


export async function getBusiestDays(
    timeframe: Timeframe
): Promise<BusiestDay[]> {

    const response =
        await apiFetch(
            `/dashboard/busiest-days?timeframe=${timeframe}`
        );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch busiest days"
        );
    }


    return response.json();
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenue[]> {

    const response = await apiFetch("/dashboard/revenue");

    if (!response.ok) {
        throw new Error("Failed to fetch monthly revenue");
    }

    return response.json();
}