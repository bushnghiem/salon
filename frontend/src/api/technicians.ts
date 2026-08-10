import { apiFetch } from "./client";

import type {
    Technician,
    TechnicianCreate,
    TechnicianUpdate,
} from "../types/technician";


export async function getTechnicians(
    search?: string
): Promise<Technician[]> {

    let endpoint = "/technicians/";

    if (search) {
        endpoint += `?search=${encodeURIComponent(search)}`;
    }

    const response = await apiFetch(endpoint);

    if (!response.ok) {
        throw new Error("Failed to fetch technicians");
    }

    return response.json();
}




export async function getTechnician(
    id: number
): Promise<Technician> {

    const response = await apiFetch(
        `/technicians/${id}`
    );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch technician"
        );
    }


    return response.json();
}


export async function createTechnician(
    technician: TechnicianCreate
): Promise<Technician> {

    const response = await apiFetch(
        "/technicians/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(technician),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to create technician"
        );
    }


    return response.json();
}


export async function updateTechnician(
    id: number,
    technician: TechnicianUpdate
): Promise<Technician> {

    const response = await apiFetch(
        `/technicians/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(technician),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update technician"
        );
    }


    return response.json();
}


export async function deleteTechnician(
    id: number
): Promise<void> {

    const response = await apiFetch(
        `/technicians/${id}`,
        {
            method: "DELETE",
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to delete technician"
        );
    }
}
