import { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";

import s from "./style.module.scss";

const SPRING_CONFIG = { stiffness: 300, damping: 20, mass: 0.5 };

export default function ContactButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      x.set(deltaX * 8);
      y.set(deltaY * 8);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }, [x, y]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const buttonClassName = [s.button, isHovered && s.hovered]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.button
      ref={buttonRef}
      className={buttonClassName}
      style={{ x: springX, y: springY, willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={s.label}>Contact me</span>
      <span className={s.icon}>
        <ArrowRight size={20} />
      </span>
    </motion.button>
  );
}
