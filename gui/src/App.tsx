import { RouterProvider } from "react-router-dom";
import { router } from "./pages/router";

export function Fallback() {
  return <p>加载中...</p>;
}

function App() {
  return <RouterProvider router={router} fallbackElement={<Fallback />} />;
}

export default App;
