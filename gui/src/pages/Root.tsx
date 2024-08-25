import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/chat", { replace: true });
    }
  }, []);
  return (
    <div className="root">
      <Outlet />
    </div>
  );
};

export default Root;
