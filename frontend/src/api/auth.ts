import { apiFetch } from "./client";
import type { Token } from "../types/auth";

export async function login(
    email: string,
    password: string
): Promise<Token> {

    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type":
                "application/x-www-form-urlencoded",
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Invalid credentials");
    }

    return response.json();
}
