export type EventSourceServer = {
  url: string;
  onmessage: (event: MessageEvent) => void;
  onerror: (event: Event) => void;
};

export function eventSourceServer({
  url,
  onmessage,
  onerror,
}: EventSourceServer) {
  const eventSource = new EventSource(url);

  eventSource.onmessage = onmessage;

  eventSource.onerror = onerror;
}
