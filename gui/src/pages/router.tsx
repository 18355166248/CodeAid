import { createMemoryRouter } from "react-router-dom";
import Root from "./Root";
import { lazy } from "react";

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
