import { motion } from "framer-motion";

import { LANDING_EASE } from "@/feature/landing/utils/reveal.util";
import { Box, Image, Text } from "@/shared/components/ui";

import type { CapabilityService } from "../capability.util";

import s from "./style.module.scss";

interface Props {
  service: CapabilityService;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  return (
    <motion.article
      className={s.item}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: LANDING_EASE, delay: index * 0.12 }}
    >
      <Box className={s.card}>
        <Box className={s.halftone} aria-hidden />

        <Box className={s.copy}>
          <Text as="span" className={s.title}>
            {service.title}
          </Text>
          <Text as="span" className={s.description}>
            {service.description}
          </Text>
        </Box>

        <Box className={s.stack}>
          {service.stack.map((item) => (
            <Box key={item.name} className={s.tool} title={item.name}>
              <Image
                src={item.icon}
                alt={item.name}
                objectFit="contain"
                className={item.invert ? s.inverted : undefined}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Text as="p" className={s.caption}>
        {service.caption}
      </Text>
    </motion.article>
  );
}
