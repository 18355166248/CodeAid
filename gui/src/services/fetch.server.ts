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
  try {
    const fetchConfig: RequestInit = {
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

    return fetch(url, fetchConfig);
  } catch (e) {
    console.log(e);
  }
}
