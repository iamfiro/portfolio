import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";

import s from "./Header.module.scss";

function useSeoulTime() {
  const format = () => {
    const now = new Date();
    const h = now.toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      hour12: true,
    }).replace(/\s*(AM|PM)/, "");
    const m = now.toLocaleString("en-US", {
      timeZone: "Asia/Seoul",
      minute: "2-digit",
    }).padStart(2, "0");
    const period = now
      .toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
        hour: "numeric",
        hour12: true,
      })
      .split(" ")[1];

    return { h, m, period };
  };

  const [time, setTime] = useState(format);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(format());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return time;
}

export default function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.includes(path);
  const seoulTime = useSeoulTime();

  return (
    <header className={s.container}>
      <img src="/logo.svg" alt="logo" className={s.logo} />
      <ul className={s.link}>
        <li className={location.pathname === "/" ? s.active : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={isActive("/projects") ? s.active : ""}>
          <Link to="/projects">Project</Link>
        </li>
        <li className={isActive("/awards") ? s.active : ""}>
          <Link to="/awards">Award</Link>
        </li>
        <li className={isActive("/blog") ? s.active : ""}>
          {isActive("/blog") ? (
            <span>Blog</span>
          ) : (
            <Link to="/blog">
              Blog
            </Link>
          )}
        </li>
      </ul>
      <ul className={s.link}>
        <li>
          <a href="https://www.linkedin.com/in/sungju-cho/" target="_blank" rel="noopener noreferrer">
            <span className={s.iconLinkedin} />
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://github.com/iamfiro" target="_blank" rel="noopener noreferrer">
            <span className={s.iconGithub} />
            Github
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/chxs_u/" target="_blank" rel="noopener noreferrer">
            <span className={s.iconInstagram} />
            Instagram
          </a>
        </li>
      </ul>
      <div className={s.time}>
        <span className={s.timeClock}>
          {seoulTime.h}
          <span className={s.blink}>:</span>
          {seoulTime.m} {seoulTime.period}
        </span>
        <span className={s.timeLabel}>
          <Globe size={10} />
          Seoul, Korea
        </span>
      </div>
    </header>
  );
}
