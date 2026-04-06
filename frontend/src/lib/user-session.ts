export type UserSession = {
  username: string;
  fullName: string;
  avatarUrl?: string;
  role?: string;
  email?: string;
  phone?: string;
};

export const USER_TOKEN_KEY = "user_token";
export const USER_SESSION_KEY = "user_session";
export const AUTH_EVENT_NAME = "user-auth-change";

export function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }
}

export function readUserSession(): UserSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(USER_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function writeUserSession(session: UserSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
  dispatchAuthChange();
}

export function clearUserSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(USER_TOKEN_KEY);
  window.localStorage.removeItem(USER_SESSION_KEY);
  dispatchAuthChange();
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
