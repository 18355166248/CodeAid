import { RouterProvider } from "react-router-dom";
import { router } from "./pages/router";
import { useSetup } from "./hooks/useSetup";

export function Fallback() {
  return <p>加载中...</p>;
}

function App() {
  useSetup();

  return <RouterProvider router={router} fallbackElement={<Fallback />} />;
}

export default App;
