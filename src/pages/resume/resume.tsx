import { useQuery } from "@tanstack/react-query";
import { Printer } from "lucide-react";
import { Helmet } from "react-helmet";

import { LandingPageShell } from "@/feature/landing/components";
import { ResumeEntry, ResumeSection } from "@/feature/resume/components";
import { getResume } from "@/feature/resume/data";
import { formatResumePeriod } from "@/feature/resume/resume.util";
import type { ResumeResponse } from "@/feature/resume/schema";
import {
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
} from "@/shared/components/ui";
import { LINK, STACK_DATA } from "@/shared/constants";

import s from "./resume.module.scss";

const CONTACTS = [
  { label: "Email", href: `mailto:${LINK.email}` },
  { label: "GitHub", href: LINK.github },
  { label: "LinkedIn", href: LINK.linkedin },
  { label: "Portfolio", href: LINK.portfolio },
] as const;

function toDisplayUrl(href: string): string {
  return href.replace(/^(mailto:|https?:\/\/)/, "").replace(/\/$/, "");
}

export default function Resume() {
  const { data } = useQuery<ResumeResponse>({
    queryKey: ["resume"],
    queryFn: getResume,
  });

  const resume = data?.data;

  return (
    <LandingPageShell
      titleId="resume-title"
      lines={["한 장으로 정리한", "경험과 성과"]}
      className={s.container}
    >
      <Helmet>
        <title>조성주_이력서</title>
      </Helmet>

      <Flex justify="center" className={s.toolbar}>
        <Button
          size="md"
          variant="secondary"
          leftIcon={<Printer size={16} aria-hidden="true" />}
          onClick={() => window.print()}
          className={s.printButton}
        >
          PDF로 저장
        </Button>
      </Flex>

      <article className={s.paper}>
        <Flex justify="space-between" align="flex-start" gap={24}>
          <Stack gap={12} className={s.profile}>
            <Stack gap={4}>
              <Heading as="h1" className={s.name}>
                조성주
              </Heading>
              <Text weight="medium" className={s.role}>
                풀스택 개발자
              </Text>
            </Stack>
            <Text size="sm" className={s.summary}>
              소프트웨어를 바탕으로 일상의 문제를 해결하는 풀스택 개발자입니다.
              새로운 기술을 배우는 것을 두려워하지 않으며, 사람들이 좋아하고
              필요로 하는 서비스를 만들고 있습니다.
            </Text>
            <Flex wrap className={s.contacts}>
              {CONTACTS.map(({ label, href }) => (
                <Text as="span" size="sm" key={label}>
                  <Text as="span" size="sm" weight="semibold">
                    {label}
                  </Text>{" "}
                  <Link href={href} external variant="subtle">
                    {toDisplayUrl(href)}
                  </Link>
                </Text>
              ))}
            </Flex>
          </Stack>
          <Image
            src="/me.png"
            alt="조성주 프로필 사진"
            objectFit="cover"
            className={s.photo}
          />
        </Flex>

        <ResumeSection title="기술 스택">
          {STACK_DATA.map((category) => (
            <ResumeEntry
              key={category.label}
              period={category.label}
              title={category.items.map((item) => item.name).join(" · ")}
            />
          ))}
        </ResumeSection>

        {resume && resume.projects.length > 0 && (
          <ResumeSection title="프로젝트">
            {resume.projects.map((project) => (
              <ResumeEntry
                key={project.id}
                period={formatResumePeriod(project.startDate, project.endDate)}
                title={project.title}
                description={project.description}
                tags={project.techStack}
                href={
                  project.deployUrl ??
                  project.githubUrl ??
                  `${LINK.portfolio}/projects/${project.id}`
                }
              />
            ))}
          </ResumeSection>
        )}

        {resume && resume.awards.length > 0 && (
          <ResumeSection title="수상">
            {resume.awards.map((award) => (
              <ResumeEntry
                key={award.id}
                period={formatResumePeriod(award.date)}
                title={award.title}
                meta={award.organization}
              />
            ))}
          </ResumeSection>
        )}

        {resume && resume.activities.length > 0 && (
          <ResumeSection title="활동">
            {resume.activities.map((activity) => (
              <ResumeEntry
                key={activity.id}
                period={formatResumePeriod(activity.date)}
                title={activity.title}
                description={activity.description}
                href={activity.href}
              />
            ))}
          </ResumeSection>
        )}

        {resume && resume.posts.length > 0 && (
          <ResumeSection title="글">
            {resume.posts.map((post) => (
              <ResumeEntry
                key={post.id}
                period={formatResumePeriod(post.date)}
                title={post.title}
                description={post.description}
                href={`${LINK.portfolio}/blog/${post.id}`}
              />
            ))}
          </ResumeSection>
        )}
      </article>
    </LandingPageShell>
  );
}
