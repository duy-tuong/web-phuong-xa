import { NextRequest } from "next/server";

import {
  buildRemoteProxyUrl,
  getRemoteBasicAuthHeader,
  REMOTE_ASSET_FALLBACK_ORIGIN,
  REMOTE_API_ORIGIN,
} from "@/lib/api-base-url";

const FORWARDED_REQUEST_HEADERS = ["accept", "content-type", "x-admin-authorization"] as const;
const FORWARDED_RESPONSE_HEADERS = ["content-type", "content-disposition"] as const;

function buildUploadFallbackUrl(pathSegments: string[], search: string) {
  const sanitizedPath = pathSegments.map((segment) => encodeURIComponent(segment)).join("/");
  const url = new URL(REMOTE_ASSET_FALLBACK_ORIGIN);

  url.pathname = `/${sanitizedPath}`;
  url.search = search;

  return url.toString();
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const targetUrl = buildRemoteProxyUrl(pathSegments, request.nextUrl.search);
  const targetsStaticUpload = pathSegments[0] === "uploads";
  const headers = new Headers();

  for (const headerName of FORWARDED_REQUEST_HEADERS) {
    const headerValue = request.headers.get(headerName);
    if (headerValue) {
      headers.set(headerName, headerValue);
    }
  }

  const basicAuthHeader = getRemoteBasicAuthHeader(targetsStaticUpload ? "asset" : "api");
  if (basicAuthHeader) {
    headers.set("Authorization", basicAuthHeader);
  } else {
    const bearerHeader = request.headers.get("x-admin-authorization");
    if (bearerHeader) {
      headers.set("Authorization", bearerHeader);
    }
  }

  const requestInit: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(request.method)) {
    requestInit.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(targetUrl, requestInit);

  if (
    targetsStaticUpload &&
    upstreamResponse.status === 404 &&
    REMOTE_ASSET_FALLBACK_ORIGIN !== REMOTE_API_ORIGIN
  ) {
    const fallbackHeaders = new Headers(headers);
    const fallbackBasicAuthHeader = getRemoteBasicAuthHeader("asset");

    if (fallbackBasicAuthHeader) {
      fallbackHeaders.set("Authorization", fallbackBasicAuthHeader);
    } else {
      fallbackHeaders.delete("Authorization");
    }

    const fallbackResponse = await fetch(buildUploadFallbackUrl(pathSegments, request.nextUrl.search), {
      ...requestInit,
      headers: fallbackHeaders,
    });

    if (fallbackResponse.ok) {
      const fallbackResponseHeaders = new Headers();

      for (const headerName of FORWARDED_RESPONSE_HEADERS) {
        const headerValue = fallbackResponse.headers.get(headerName);
        if (headerValue) {
          fallbackResponseHeaders.set(headerName, headerValue);
        }
      }

      return new Response(fallbackResponse.body, {
        status: fallbackResponse.status,
        headers: fallbackResponseHeaders,
      });
    }
  }

  const responseHeaders = new Headers();

  for (const headerName of FORWARDED_RESPONSE_HEADERS) {
    const headerValue = upstreamResponse.headers.get(headerName);
    if (headerValue) {
      responseHeaders.set(headerName, headerValue);
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}
