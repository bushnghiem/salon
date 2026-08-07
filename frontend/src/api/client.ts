const API_URL = "http://localhost:8000";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: token
        ? `Bearer ${token}`
        : "",
      ...(options.headers || {}),
    },
  });
}
