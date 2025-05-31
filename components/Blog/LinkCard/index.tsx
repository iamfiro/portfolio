import { cloneElement } from "react";
import Link from "next/link";
import cn from "classnames";

import { LayoutSizeProps } from "@/types/layout";
import { HStack, Typo, VStack } from "@/components/ui";

import s from "./style.module.scss";

interface Props extends Partial<LayoutSizeProps> {
    href: string;
    title: string;
    category: {
        name: string;
        icon: React.ReactNode;
    };
}

export default function BlogLinkCard({ href, title, category, fullWidth, fullHeight }: Props) {
    const cloneIcon = cloneElement(category.icon as React.ReactElement, {
        size: 14,
    } as {size: number});
    
    return (
        <Link href={href} className={cn(s.linkCard, {
            [s.fullWidth]: fullWidth,
            [s.fullHeight]: fullHeight,
        })}>
            <VStack>
                <HStack className={s.category}>
                    {cloneIcon}
                    <Typo.Caption>{category.name}</Typo.Caption>
                </HStack>
                <Typo.Body weight={500}>{title}</Typo.Body>
                <Typo.Subtext className={s.date}>2025.05.31</Typo.Subtext>
            </VStack>
        </Link>
    )
}