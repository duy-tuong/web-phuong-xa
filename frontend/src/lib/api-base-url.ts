const DEFAULT_REMOTE_API_URL = "https://localhost:7065/api";
const DEFAULT_CLIENT_PROXY_API_URL = "/api/proxy";

function getRequiredRemoteApiUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (trimmedValue) {
    return trimmedValue.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_REMOTE_API_URL;
  }

  throw new Error(
    "Missing REMOTE_API_URL or NEXT_PUBLIC_API_URL in production. Set it to your deployed backend API URL (for example: https://your-backend.azurewebsites.net/api).",
  );
}

function normalizeAbsoluteApiUrl(value?: string) {
  return getRequiredRemoteApiUrl(value);
}

function normalizeClientApiUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return DEFAULT_CLIENT_PROXY_API_URL;
  }

  return trimmedValue.replace(/\/+$/, "");
}

function normalizeAbsoluteOrigin(value?: string, fallback?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return fallback || REMOTE_API_ORIGIN;
  }

  return new URL(trimmedValue).origin;
}

export const REMOTE_API_BASE_URL = normalizeAbsoluteApiUrl(
  process.env.REMOTE_API_URL || process.env.NEXT_PUBLIC_API_URL,
);

export const CLIENT_PROXY_API_BASE_URL = normalizeClientApiUrl(
  process.env.NEXT_PUBLIC_API_PROXY_URL || DEFAULT_CLIENT_PROXY_API_URL,
);

export const REMOTE_API_ORIGIN = new URL(REMOTE_API_BASE_URL).origin;
export const LOCAL_ASSET_ORIGIN = REMOTE_API_ORIGIN;
export const REMOTE_ASSET_FALLBACK_ORIGIN = normalizeAbsoluteOrigin(
  process.env.REMOTE_ASSET_ORIGIN,
  REMOTE_API_ORIGIN,
);

export const API_BASE_URL =
  typeof window === "undefined"
    ? REMOTE_API_BASE_URL
    : CLIENT_PROXY_API_BASE_URL;

export function buildRemoteProxyUrl(pathSegments: string[], search: string) {
  const sanitizedPath = pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
  const targetsStaticUpload = pathSegments[0] === "uploads";
  const url = new URL(targetsStaticUpload ? LOCAL_ASSET_ORIGIN : REMOTE_API_BASE_URL);

  url.pathname = targetsStaticUpload
    ? `/${sanitizedPath}`
    : `${url.pathname.replace(/\/+$/, "")}/${sanitizedPath}`;
  url.search = search;

  return url.toString();
}

export function getRemoteBasicAuthHeader(target: "api" | "asset" = "api") {
  const username =
    target === "asset"
      ? process.env.REMOTE_ASSET_BASIC_USERNAME?.trim() || process.env.REMOTE_API_BASIC_USERNAME?.trim()
      : process.env.REMOTE_API_BASIC_USERNAME?.trim();
  const password =
    target === "asset"
      ? process.env.REMOTE_ASSET_BASIC_PASSWORD?.trim() || process.env.REMOTE_API_BASIC_PASSWORD?.trim()
      : process.env.REMOTE_API_BASIC_PASSWORD?.trim();

  if (!username || !password) {
    return "";
  }

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export function resolveApiAssetUrl(value?: string | null) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("data:") ||
    trimmedValue.startsWith("blob:")
  ) {
    return trimmedValue;
  }

  if (
    trimmedValue === CLIENT_PROXY_API_BASE_URL ||
    trimmedValue.startsWith(`${CLIENT_PROXY_API_BASE_URL}/`)
  ) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("/")) {
    return `${CLIENT_PROXY_API_BASE_URL}${trimmedValue}`;
  }

  return trimmedValue;
}
