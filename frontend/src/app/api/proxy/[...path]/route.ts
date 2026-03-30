import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl =
  process.env.BACKEND_BASE_URL ||
  "https://backend-phuongxa-api-duhcehb0fmcjgkbx.southeastasia-01.azurewebsites.net/api";
const backendOrigin = backendBaseUrl.replace(/\/api\/?$/, "");
const basicUser = process.env.BASIC_AUTH_USER || "11301703";
const basicPass = process.env.BASIC_AUTH_PASS || "60-dayfreetrial";

const buildTargetUrl = (request: NextRequest) => {
  const path = request.nextUrl.pathname.replace(/^\/api\/proxy/, "");
  const search = request.nextUrl.search;
  const safeApiBase = backendBaseUrl.replace(/\/$/, "");
  const safeOriginBase = backendOrigin.replace(/\/$/, "");
  const base = path.startsWith("/uploads") ? safeOriginBase : safeApiBase;

  return `${base}${path}${search}`;
};

const buildHeaders = (request: NextRequest) => {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("content-length");
  headers.delete("accept-encoding");

  const incomingAuth = headers.get("authorization");
  if (incomingAuth) {
    headers.set("x-forwarded-authorization", incomingAuth);
  }

  if (basicUser && basicPass) {
    const token = Buffer.from(`${basicUser}:${basicPass}`, "utf8").toString(
      "base64",
    );
    headers.set("authorization", `Basic ${token}`);
  }

  return headers;
};

const handler = async (request: NextRequest) => {
  const targetUrl = buildTargetUrl(request);
  const method = request.method;
  const headers = buildHeaders(request);

  let body: ArrayBuffer | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await response.arrayBuffer();
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Proxy request failed.",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 502 },
    );
  }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
