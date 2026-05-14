import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";

import s from "./Header.module.scss";

const EASE = [0.76, 0, 0.24, 1] as const;

const navScrollVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0, 0, 0.2, 1] },
  },
  hidden: {
    y: -10,
    opacity: 0,
    filter: "blur(3px)",
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: [0.76, 0, 0.24, 1] },
  },
};

const overlayItemVariants: Variants = {
  hidden: { opacity: 0, x: -24, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: i * 0.07 },
  }),
};

function useScrollHidden() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const accumulated = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      if (y < 80) {
        setHidden(false);
        accumulated.current = 0;
        return;
      }

      if (delta > 0) {
        accumulated.current = Math.max(0, accumulated.current) + delta;
        if (accumulated.current > 60) {
          setHidden(true);
          accumulated.current = 0;
        }
      } else {
        accumulated.current = Math.min(0, accumulated.current) + delta;
        if (accumulated.current < -40) {
          setHidden(false);
          accumulated.current = 0;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

function useSeoulTime() {
  const format = () => {
    const now = new Date();
    const h = now
      .toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        hour12: true,
      })
      .replace(/\s*(AM|PM)/, "");
    const m = now
      .toLocaleString("en-US", {
        timeZone: "Asia/Seoul",
        minute: "2-digit",
      })
      .padStart(2, "0");
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

interface Props {
  hideOnScroll?: boolean;
  logoHref?: string;
}

export default function Header({
  hideOnScroll = false,
  logoHref = "/",
}: Props) {
  const location = useLocation();
  const { navigateTo, pageReady } = usePageTransition();
  const isActive = (path: string) => location.pathname.includes(path);
  const seoulTime = useSeoulTime();
  const scrollHidden = useScrollHidden();
  const hidden = hideOnScroll && scrollHidden;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      setMenuOpen(false);
      navigateTo(path);
    },
    [navigateTo],
  );

  let itemIndex = 0;

  const navItems = [
    { path: "/", label: "Home", exact: true },
    { path: "/projects", label: "Project" },
    { path: "/awards", label: "Award" },
    { path: "/blog", label: "Blog" },
  ];

  const socialItems = [
    {
      href: "https://www.linkedin.com/in/sungju-cho/",
      icon: s.iconLinkedin,
      label: "LinkedIn",
    },
    { href: "https://github.com/iamfiro", icon: s.iconGithub, label: "Github" },
    {
      href: "https://www.instagram.com/chxs_u/",
      icon: s.iconInstagram,
      label: "Instagram",
    },
  ];

  return (
    <>
      <header className={`${s.container} ${menuOpen ? s.menuIsOpen : ""}`}>
        <a href={logoHref} onClick={(e) => handleNavClick(e, logoHref)}>
          <motion.img
            src="/logo.svg"
            alt="logo"
            className={s.logo}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={pageReady ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          />
        </a>
        <motion.ul
          className={s.link}
          variants={navScrollVariants}
          animate={hidden ? "hidden" : "visible"}
          style={{ pointerEvents: hidden ? "none" : undefined }}
        >
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
                animate={
                  pageReady
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : undefined
                }
                transition={{ duration: 0.7, ease: EASE, delay }}
              >
                {item.path === "/blog" && isActive("/blog") ? (
                  <span>{item.label}</span>
                ) : (
                  <a
                    href={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                  >
                    {item.label}
                  </a>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
        <motion.ul
          className={s.link}
          variants={navScrollVariants}
          animate={hidden ? "hidden" : "visible"}
          style={{ pointerEvents: hidden ? "none" : undefined }}
        >
          {socialItems.map((item) => {
            const delay = 0.15 + itemIndex * 0.08;
            itemIndex++;

            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={
                  pageReady
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : undefined
                }
                transition={{ duration: 0.7, ease: EASE, delay }}
              >
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className={item.icon} />
                  {item.label}
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
        <motion.div
          className={s.time}
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={
            pageReady ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined
          }
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: 0.15 + itemIndex * 0.08,
          }}
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
        <button
          className={s.menuButton}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={s.overlay}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className={s.overlayNav}>
              {navItems.map((item, i) => {
                const active = item.exact
                  ? location.pathname === item.path
                  : isActive(item.path);

                return (
                  <motion.li
                    key={item.path}
                    className={`${s.overlayNavItem} ${active ? s.overlayNavActive : ""}`}
                    custom={i}
                    variants={overlayItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {item.path === "/blog" && isActive("/blog") ? (
                      <span>{item.label}</span>
                    ) : (
                      <a
                        href={item.path}
                        onClick={(e) => handleNavClick(e, item.path)}
                      >
                        {item.label}
                      </a>
                    )}
                  </motion.li>
                );
              })}
            </ul>
            <ul className={s.overlaySocial}>
              {socialItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={navItems.length + i}
                  variants={overlayItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.overlaySocialLink}
                    title={item.label}
                  >
                    <span className={item.icon} />
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
