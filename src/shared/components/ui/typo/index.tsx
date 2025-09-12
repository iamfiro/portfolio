import React from "react";

import styles from "./styles.module.scss";

// 타이포그래피 variant 타입 정의
type TypographyVariant =
  | "display"
  | "headline"
  | "bodyLarge"
  | "body"
  | "subtext"
  | "caption";

// HTML 텍스트 태그의 모든 props를 상속받는 타입
type TypoProps<T extends React.ElementType = "span"> = {
  as?: T;
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "variant" | "children" | "className"
>;

// Typo 컴포넌트
const Typo = <T extends React.ElementType = "span">({
  as,
  variant = "body",
  children,
  className,
  ...props
}: TypoProps<T>) => {
  const Component = as || "span";

  const variantClass = styles[variant];
  const combinedClassName = `${variantClass} ${className || ""}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

// 개별 타이포그래피 컴포넌트들
Typo.Display = (props: any) => <Typo variant="display" {...props} />;
Typo.Headline = (props: any) => <Typo variant="headline" {...props} />;
Typo.BodyLarge = (props: any) => <Typo variant="bodyLarge" {...props} />;
Typo.Body = (props: any) => <Typo variant="body" {...props} />;
Typo.Subtext = (props: any) => <Typo variant="subtext" {...props} />;
Typo.Caption = (props: any) => <Typo variant="caption" {...props} />;

export default Typo;
