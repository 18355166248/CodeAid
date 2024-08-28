import { createMemoryRouter } from "react-router-dom";
import Root from "./Root";
import { lazy } from "react";

function loader() {
  const data = { some: "thing" };
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json; utf-8",
    },
  });
}

const Chat = lazy(
  () => import(/* webpackChunkName: "BusinessManage" */ "./Chat"),
);

export const router = createMemoryRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
]);
