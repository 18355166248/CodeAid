export interface StreamRes {
  url: string;
  method?: string;
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export async function getStream({
  url,
  data,
  params,
  method = "GET",
  headers,
}: StreamRes) {
  const controller = new AbortController();
  const fetchConfig: RequestInit = {
    signal: controller.signal,
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  };
  if (method === "GET" && params) {
    const queryString = Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            params[key] as unknown as string,
          )}`,
      )
      .join("&");
    url = `${url}?${queryString}`;
  } else if (method === "POST" && data) {
    fetchConfig.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, fetchConfig);
    return { res, abort: () => controller.abort() };
  } catch (error) {
    return Promise.reject(error);
  }
}
