const API_BASE = "/api/v1/student-ms";
const AUTH_BASE = "/api/v1/auth";
const TOKEN_KEY = "sms_token";
const USER_KEY = "sms_username";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUsername() {
  return sessionStorage.getItem(USER_KEY);
}

export function setSession(token, username) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, username);
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * Thin fetch wrapper: attaches the bearer token, throws ApiError with the
 * backend's message on failure, and lets callers decide what to do on 401
 * (the AuthContext listens for a "sms:unauthorized" event to log out).
 */
async function request(path, options = {}) {
  const headers = Object.assign({}, options.headers || {});
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    clearSession();
    window.dispatchEvent(new CustomEvent("sms:unauthorized"));
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (res.status === 204 || res.status === 202) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const message = (data && data.message) ? data.message : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }

  return data;
}

export async function login(username, password) {
  const res = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((data && data.message) || "Invalid username or password.", res.status);
  }
  return data; // { token, username }
}

export async function register(username, password) {
  const res = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((data && data.message) || "Could not create account.", res.status);
  }
  return data; // { token, username }
}

export const StudentsApi = {
  list: () => request(`${API_BASE}/students`),
  create: (student) => request(`${API_BASE}/students`, { method: "POST", body: JSON.stringify(student) }),
  update: (id, student) => request(`${API_BASE}/students/${id}`, { method: "PUT", body: JSON.stringify(student) }),
  remove: (id) => request(`${API_BASE}/students/${id}`, { method: "DELETE" }),
  findById: (id) => request(`${API_BASE}/students/find/id/${id}`),
  findByEmail: (email) => request(`${API_BASE}/students/find/email/${encodeURIComponent(email)}`),
  findByIndex: (indexNumber) => request(`${API_BASE}/students/find/index/${indexNumber}`),
  findByDobRange: (dob1, dob2) => request(`${API_BASE}/students/find/date-of-birth?dob1=${dob1}&dob2=${dob2}`),
  listProjects: (studentId) => request(`${API_BASE}/students/${studentId}/projects`),
  createProject: (studentId, project) =>
    request(`${API_BASE}/students/${studentId}/projects`, { method: "POST", body: JSON.stringify(project) }),
};

export const ProjectsApi = {
  listAll: () => request(`${API_BASE}/projects`),
  remove: (id) => request(`${API_BASE}/projects/${id}`, { method: "DELETE" }),
};
