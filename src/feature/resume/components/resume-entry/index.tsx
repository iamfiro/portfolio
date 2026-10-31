import type { HTMLAttributes, ReactNode } from "react";

import { Flex, Link, Stack, Text } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  period?: string;
  meta?: string | null;
  description?: ReactNode;
  tags?: string[];
  href?: string | null;
}

export default function ResumeEntry({
  title,
  period,
  meta,
  description,
  tags,
  href,
  className,
  ...props
}: Props) {
  const entryClassName = [s.entry, className].filter(Boolean).join(" ");

  return (
    <div className={entryClassName} {...props}>
      <Text as="span" size="sm" className={s.period}>
        {period}
      </Text>
      <Stack gap={4} className={s.body}>
        <Flex align="baseline" gap={8} wrap>
          {href ? (
            <Link href={href} external className={s.title}>
              {title}
            </Link>
          ) : (
            <Text as="strong" className={s.title}>
              {title}
            </Text>
          )}
          {meta && (
            <Text as="span" size="sm" color="subtle" className={s.meta}>
              {meta}
            </Text>
          )}
        </Flex>
        {description && (
          <Text size="sm" className={s.description}>
            {description}
          </Text>
        )}
        {tags && tags.length > 0 && (
          <Text size="xs" color="subtle" className={s.tags}>
            {tags.join(" · ")}
          </Text>
        )}
      </Stack>
    </div>
  );
}
