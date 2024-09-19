import { globalAgent } from "https";
import fetch, { RequestInit, Response } from "node-fetch";
import tls from "node:tls";

export function fetchWithRequestOptions(
  url_: URL | string,
  init?: RequestInit,
): Promise<Response> {
  let url = url_;
  if (typeof url === "string") {
    url = new URL(url);
  }

  const TIMEOUT = 7200; // 7200 seconds = 2 hours

  let globalCerts: string[] = [];
  if (process.env.IS_BINARY) {
    if (Array.isArray(globalAgent.options.ca)) {
      globalCerts = [...globalAgent.options.ca.map((cert) => cert.toString())];
    } else if (typeof globalAgent.options.ca !== "undefined") {
      globalCerts.push(globalAgent.options.ca.toString());
    }
  }
  const ca = Array.from(new Set([...tls.rootCertificates, ...globalCerts]));

  const timeout = TIMEOUT * 1000; // measured in ms

  const agentOptions: { [key: string]: any } = {
    ca,
    timeout,
    sessionTimeout: timeout,
    keepAlive: true,
    keepAliveMsecs: timeout,
  };

  let headers: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(init?.headers || {})) {
    headers[key] = value as string;
  }
  headers = {
    ...headers,
  };

  // Replace localhost with 127.0.0.1
  if (url.hostname === "localhost") {
    url.hostname = "127.0.0.1";
  }

  // fetch the request with the provided options
  const resp = fetch(url, {
    ...init,
    body: init?.body,
    headers: headers,
  });

  return resp;
}
