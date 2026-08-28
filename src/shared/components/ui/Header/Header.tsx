import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { usePageTransition } from "@/shared/components/layouts/page-transition/page-transition.context";

import MagneticNavLink from "./MagneticNavLink";

import s from "./Header.module.scss";

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

interface Props {
  hideOnScroll?: boolean;
  logoHref?: string;
}

export default function Header({
  hideOnScroll = false,
  logoHref = "/",
}: Props) {
  const location = useLocation();
  const { navigateTo } = usePageTransition();
  const isActive = (path: string) => location.pathname.includes(path);
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

  const navItems = [
    { path: "/", label: "홈", exact: true },
    { path: "/projects", label: "프로젝트" },
    { path: "/activities", label: "활동" },
    { path: "/blog", label: "블로그" },
  ];

  return (
    <>
      <header className={`${s.container} ${menuOpen ? s.menuIsOpen : ""}`}>
        <a href={logoHref} onClick={(e) => handleNavClick(e, logoHref)}>
          <img src="/logo.svg" alt="logo" className={s.logo} />
        </a>
        <motion.ul
          className={s.navigation}
          variants={navScrollVariants}
          animate={hidden ? "hidden" : "visible"}
          style={{ pointerEvents: hidden ? "none" : undefined }}
        >
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.path
              : isActive(item.path);

            return (
              <MagneticNavLink
                key={item.path}
                href={item.path}
                label={item.label}
                active={active}
                asText={item.path === "/blog" && isActive("/blog")}
                onNavigate={handleNavClick}
              />
            );
          })}
        </motion.ul>
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

      <div className={s.gradient} aria-hidden="true" />

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
