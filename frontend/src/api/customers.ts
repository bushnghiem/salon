import { apiFetch } from "./client";

import type {
    Customer,
    CustomerCreate,
    CustomerUpdate,
} from "../types/customer";


export async function getCustomers(
    search?: string
): Promise<Customer[]> {

    let endpoint = "/customers/";


    if (search) {
        endpoint += `?search=${encodeURIComponent(search)}`;
    }


    const response = await apiFetch(endpoint);


    if (!response.ok) {
        throw new Error("Failed to fetch customers");
    }


    return response.json();
}


export async function getCustomer(
    id: number
): Promise<Customer> {

    const response = await apiFetch(
        `/customers/${id}`
    );


    if (!response.ok) {
        throw new Error("Failed to fetch customer");
    }


    return response.json();
}


export async function createCustomer(
    customer: CustomerCreate
): Promise<Customer> {

    const response = await apiFetch(
        "/customers/",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(customer),
        }
    );


    if (!response.ok) {
        throw new Error("Failed to create customer");
    }


    return response.json();
}


export async function updateCustomer(
    id: number,
    customer: CustomerUpdate
): Promise<Customer> {

    const response = await apiFetch(
        `/customers/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(customer),
        }
    );


    if (!response.ok) {
        throw new Error("Failed to update customer");
    }


    return response.json();
}


export async function deleteCustomer(
    id: number
): Promise<void> {

    const response = await apiFetch(
        `/customers/${id}`,
        {
            method: "DELETE",
        }
    );


    if (!response.ok) {
        throw new Error("Failed to delete customer");
    }
}
