import { apiFetch } from "./client";

import type {
    Service,
    ServiceCreate,
    ServiceUpdate,
} from "../types/service";


export async function getServices(
    search?: string
): Promise<Service[]> {

    let endpoint = "/services/";


    if (search) {
        endpoint += `?search=${encodeURIComponent(search)}`;
    }


    const response = await apiFetch(endpoint);


    if (!response.ok) {
        throw new Error(
            "Failed to fetch services"
        );
    }


    return response.json();
}


export async function getService(
    id: number
): Promise<Service> {

    const response = await apiFetch(
        `/services/${id}`
    );


    if (!response.ok) {
        throw new Error(
            "Failed to fetch service"
        );
    }


    return response.json();
}


export async function createService(
    service: ServiceCreate
): Promise<Service> {

    const response = await apiFetch(
        "/services/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(service),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to create service"
        );
    }


    return response.json();
}


export async function updateService(
    id: number,
    service: ServiceUpdate
): Promise<Service> {

    const response = await apiFetch(
        `/services/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(service),
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to update service"
        );
    }


    return response.json();
}


export async function deleteService(
    id: number
): Promise<void> {

    const response = await apiFetch(
        `/services/${id}`,
        {
            method: "DELETE",
        }
    );


    if (!response.ok) {
        throw new Error(
            "Failed to delete service"
        );
    }
}