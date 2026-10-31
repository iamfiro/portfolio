import { motion } from "framer-motion";
import type { MouseEvent } from "react";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Image, Link } from "@/shared/components/ui";

import type { PreviewItem } from "../header-preview.type";

import s from "./style.module.scss";

interface Props {
  item: PreviewItem;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function PreviewPaper({ item, onNavigate }: Props) {
  const { title, href, imageUrl } = item;

  return (
    <Box className={s.stage}>
      <motion.div
        className={s.paper}
        initial={{ opacity: 0, y: 96 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: LANDING_EASE, delay: 0.12 }}
      >
        <Link
          href={href}
          className={s.link}
          aria-label={title}
          onClick={onNavigate}
        >
          {imageUrl && <Image src={imageUrl} alt="" className={s.image} />}
        </Link>
      </motion.div>
    </Box>
  );
}
