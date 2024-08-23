import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <div className="root">
      <Outlet />
    </div>
  );
};

export default Root;
