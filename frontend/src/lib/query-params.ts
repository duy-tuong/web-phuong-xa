export type QueryParamInput = string | number | null | undefined;

export function cloneSearchParams(input: string | URLSearchParams | ReadonlyURLSearchParams) {
  return new URLSearchParams(typeof input === "string" ? input : input.toString());
}

export function setOptionalQueryParam(params: URLSearchParams, key: string, value: QueryParamInput) {
  if (value == null) {
    params.delete(key);
    return;
  }

  const normalizedValue = String(value).trim();
  if (!normalizedValue) {
    params.delete(key);
    return;
  }

  params.set(key, normalizedValue);
}

export function setPageQueryParam(params: URLSearchParams, page: number) {
  if (!Number.isFinite(page) || page <= 1) {
    params.delete("page");
    return;
  }

  params.set("page", String(page));
}

export function buildPathWithSearchParams(pathname: string, params: URLSearchParams) {
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

export function parsePositivePageParam(value: string | null | undefined, fallback = 1) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

type ReadonlyURLSearchParams = {
  toString(): string;
};
