import type { HTMLAttributes, ReactNode } from "react";

import { Heading, Stack } from "@/shared/components/ui";

import s from "./style.module.scss";

interface Props extends HTMLAttributes<HTMLElement> {
  title: string;
  children: ReactNode;
}

export default function ResumeSection({
  title,
  children,
  className,
  ...props
}: Props) {
  const sectionClassName = [s.section, className].filter(Boolean).join(" ");

  return (
    <section className={sectionClassName} {...props}>
      <Heading as="h2" className={s.title}>
        {title}
      </Heading>
      <Stack gap={20}>{children}</Stack>
    </section>
  );
}
