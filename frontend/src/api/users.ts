import { apiFetch } from "./client";
import type { User } from "../types/user";


export async function getCurrentUser(): Promise<User> {

    const response = await apiFetch("/users/me");

    if (!response.ok) {
        throw new Error("Failed to get current user");
    }

    return response.json();
}
