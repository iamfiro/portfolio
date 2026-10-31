import { Box } from "@/shared/components/ui";

import { CAPABILITY_SERVICES } from "./capability.util";
import ServiceCard from "./service-card";

import s from "./style.module.scss";

/** 하는 일을 세 장의 브랜드 카드로 나란히 보여준다 */
export default function LandingCapability() {
  return (
    <Box as="section" className={s.capability} aria-label="하는 일">
      <Box className={s.grid}>
        {CAPABILITY_SERVICES.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </Box>
    </Box>
  );
}
