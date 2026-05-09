import { useLocation, Outlet } from "react-router-dom";

import s from "./style.module.scss";

export default function PageTransition() {
  const location = useLocation();

  return (
    <div key={location.pathname} className={s.page}>
      <Outlet />
    </div>
  );
}
