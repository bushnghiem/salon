import { apiFetch } from "./client";
import type { DashboardData } from "../types/dashboard";


export async function getDashboard(): Promise<DashboardData> {

    const response = await apiFetch("/dashboard/");

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
    }

    return response.json();
}
