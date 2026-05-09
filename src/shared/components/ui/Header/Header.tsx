import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

import s from "./Header.module.scss";

const EASE = [0.76, 0, 0.24, 1] as const;

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

  let itemIndex = 0;

  const navItems = [
    { path: "/", label: "Home", exact: true },
    { path: "/projects", label: "Project" },
    { path: "/awards", label: "Award" },
    { path: "/blog", label: "Blog" },
  ];

  const socialItems = [
    { href: "https://www.linkedin.com/in/sungju-cho/", icon: s.iconLinkedin, label: "LinkedIn" },
    { href: "https://github.com/iamfiro", icon: s.iconGithub, label: "Github" },
    { href: "https://www.instagram.com/chxs_u/", icon: s.iconInstagram, label: "Instagram" },
  ];

  return (
    <header className={s.container}>
      <Link to="/">
        <motion.img
          src="/logo.svg"
          alt="logo"
          className={s.logo}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        />
      </Link>
      <ul className={s.link}>
        {navItems.map((item) => {
          const delay = 0.15 + itemIndex * 0.08;
          itemIndex++;
          const active = item.exact
            ? location.pathname === item.path
            : isActive(item.path);

          return (
            <motion.li
              key={item.path}
              className={active ? s.active : ""}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay }}
            >
              {item.path === "/blog" && isActive("/blog") ? (
                <span>{item.label}</span>
              ) : (
                <Link to={item.path}>{item.label}</Link>
              )}
            </motion.li>
          );
        })}
      </ul>
      <ul className={s.link}>
        {socialItems.map((item) => {
          const delay = 0.15 + itemIndex * 0.08;
          itemIndex++;

          return (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE, delay }}
            >
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <span className={item.icon} />
                {item.label}
              </a>
            </motion.li>
          );
        })}
      </ul>
      <motion.div
        className={s.time}
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.15 + itemIndex * 0.08 }}
      >
        <span className={s.timeClock}>
          {seoulTime.h}
          <span className={s.blink}>:</span>
          {seoulTime.m} {seoulTime.period}
        </span>
        <span className={s.timeLabel}>
          <Globe size={10} />
          Seoul, Korea
        </span>
      </motion.div>
    </header>
  );
}
