---
date: 2025-9-19
description: 자바가 컴파일되고 실행되는 원리에 대해 알아보겠습니다
thumbnail: /images/thumbnail/Java가 코드를 실행하는 방법.webp
tags: [Java]
---

## Java
컴퓨터는 0과 1로 이루어진 바이트 코드를 기반으로 프로그램을 읽고 실행하며, 메모리를 관리합니다.

우리가 작성한 소스코드를 실제로 컴퓨터에서 실행하려면, 먼저 해당 소스코드를 바이트 코드로 변환하는 과정이 필요합니다.

Java는 이러한 과정을 통해 변환된 바이트 코드를 JVM 위에서 실행하며,
덕분에 Windows, macOS, Linux 등 다양한 운영체제에서 동일하게 동작할 수 있습니다.
즉, **“Write once, Run anywhere”** 라는 철학을 가진 프로그래밍 언어입니다.

이번 포스팅 통해 자바가 컴파일되고 실행되는 원리에 대해 알아보겠습니다.

## JDK, JRE, JVM 개념 정리
### JDK
JDK는 자바 개발 도구(Java Development Kit)의 약자로, 자바로 프로그램을 만드는 데 사용되는 개발 도구와 라이브러리를 제공하는 모음입니다.
JDK는 컴파일러(javac), 디버깅 도구, 자바 가상 머신 (JVM) 등을 포함하고 있습니다.

**JDK의 종류**

- Java SE: Java Platform Standard Edition
자바 플랫폼의 기본 버전으로, 일반적인 환경에서 자바 애플리케이션을 실행하기 위한 표준 플랫폼 입니다.
Java EE, ME, Card 모두 SE 버전을 기반으로 API를 확장하거나 경량화하는 방식으로 구현됩니다.

- Java EE: Java Platform, Enterprise Edition
기업의 대규모 분산 시스템을 구축하는데 특화된 기능을 제공하는 SE 확장판이며, 내결함성 분산 다계층 소프트웨어를 구축하기 위한 추가 라이브러리를 제공합니다.

- Java ME: Java Platform, Micro Edition
모바일 장치에 특화된 API를 제공하는 라이브러리가 있습니다

### JRE
JRE는 Java Runtime Environment의 약자로, 자바 프로그램이 실행될 수 있는 최소한의 환경을 제공합니다. 
여기에는, JVM과 표준 라이브러리 (java.io, java.base, java.util 등)가 포함되며
또한 자바 프로그램의 기본 설정(인증서 저장소, 로케일/폰트, 인코딩 등)도 제공합니다.

### JVM
JVM은 Java Virtual Machine의 약자로, javac로 컴파일 된 .class 파일이 실행될 수 있는 환경입니다.
컴파일 된 바이트 코드를 운영체제 위에서 실행될 수 있는 환경을 제공합니다

요약

> JDK = JRE + (javac, jdb, javadoc, jlink 등 개발 도구)
> JRE = JVM + 표준 라이브러리 + 런타임 리소스/설정
> JVM = 바이트코드 실행 엔진(클래스 로딩/검증/해석/JIT/GC)

```tsx
import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

import { getPost } from "@/feature/blog/api";
import { Giscus } from "@/feature/blog/components";
import { PostResponse } from "@/feature/blog/schema";
import { BaseLayout } from "@/shared/components/layouts";
import {
  Avatar,
  FlexAlign,
  HStack,
  MarkdownRenderer,
  Spacing,
  Tag,
  Typo,
  VStack,
} from "@/shared/components/ui";

import "@/shared/styles/markdown.scss";
import "@/shared/styles/prism-gh.scss";
import s from "./blog-article.module.scss";

export default function BlogArticle() {
  const { data: post, isLoading } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => getPost(id || ""),
  });

  return (
    <>
      <Helmet>
        <title>{post.data.title}</title>
      </Helmet>
      <Spacing size={32} />
      <BaseLayout className={s.container}>
        <div className={s.sub_header}>
        <HStack align={FlexAlign.Center} gap={12}>
            <Avatar src={"/sample_profile.jpg"} size={32} />
            <Typo.Body>Cho Sungju</Typo.Body>
        </HStack>
        <HStack gap={8}>
            {post.data.tags.map((tag) => (
            <Tag size="lg" key={tag}>
                {tag}
            </Tag>
            ))}
        </HStack>
        </div>
      </BaseLayout>
    </>
  );
}

```