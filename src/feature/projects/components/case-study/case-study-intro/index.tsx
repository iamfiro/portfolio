import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import {
  getRevealProps,
  LANDING_EASE,
} from "@/feature/landing/utils/reveal.util";
import type { CaseStudy, Project } from "@/feature/projects/schema";
import { getStackIcons } from "@/feature/projects/utils";
import { Box, Image, Link, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props {
  project: Project;
  caseStudy: CaseStudy;
}

function formatPeriod(startDate: string, endDate: string | null): string {
  const format = (date: string) => date.slice(0, 7).replace("-", ".");
  return `${format(startDate)} — ${endDate ? format(endDate) : "진행 중"}`;
}

/** 머리 아래로 소개 문단·태그·링크를 가운데 정렬하고, 큰 썸네일을 펼친다 */
export default function CaseStudyIntro({ project, caseStudy }: Props) {
  const stackIcons = getStackIcons(project.techStack);
  const links = [
    { href: project.githubUrl, label: "GitHub" },
    { href: project.deployUrl, label: "서비스 보기" },
  ].filter((link): link is { href: string; label: string } =>
    Boolean(link.href),
  );

  return (
    <Box className={s.intro}>
      <motion.div className={s.summary} {...getRevealProps()}>
        {caseStudy.lead && (
          <Text as="p" className={s.lead}>
            {caseStudy.lead}
          </Text>
        )}

        <Box className={s.chips}>
          {caseStudy.tags.map((tag) => (
            <Text key={tag} as="span" className={s.chip}>
              {tag}
            </Text>
          ))}
        </Box>

        {links.length > 0 && (
          <Box className={s.links}>
            {links.map(({ href, label }) => (
              <Link key={label} href={href} external className={s.link}>
                <Text as="span" className={s.linkText}>
                  {label}
                </Text>
                <ArrowUpRight size={16} aria-hidden />
              </Link>
            ))}
          </Box>
        )}
      </motion.div>

      {project.thumbnailUrl && (
        <Box className={s.showcase}>
          {/* 아래에서 위로 걷히며 드러나는 썸네일 */}
          <motion.div
            className={s.media}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: LANDING_EASE }}
          >
            <Image
              src={project.thumbnailUrl}
              alt={`${project.title} 대표 이미지`}
              className={s.thumbnail}
            />
          </motion.div>

          <Box className={s.meta}>
            <Text as="span" className={s.period}>
              {formatPeriod(project.startDate, project.endDate)}
            </Text>
            {stackIcons.length > 0 && (
              <Box className={s.stack}>
                {stackIcons.map(({ tech, src }) => (
                  <Box key={tech} className={s.tool} title={tech}>
                    <Image src={src} alt={tech} objectFit="contain" />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
