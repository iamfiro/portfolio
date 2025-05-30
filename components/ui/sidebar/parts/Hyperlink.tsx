'use client';

import { BriefcaseBusiness, FolderKanban, Home, Rss } from "lucide-react";
import { usePathname } from "next/navigation";

import VStack from "@/components/ui/VStack";
import { HStack, SidebarHyperlinkProps, Typo } from "@/components/ui";

import s from './parts.module.scss';

const icons = {
    Home,
    FolderKanban,
    Rss,
    BriefcaseBusiness
} as const;

export default function SidebarHyperlink({links}: SidebarHyperlinkProps) {
    const pathname = usePathname();

    return (
        <VStack className={s.hyperlinkContainer}>
            {links.map((link) => {
                const Icon = link.icon ? icons[link.icon as keyof typeof icons] : null;
                const styledIcon = Icon ? <Icon size={18} /> : null;
                const isActive = pathname === link.href;

                return (
                    <a href={link.href} className={`${s.hyperlink} ${isActive ? s.active : ''}`} key={link.href}>
                        <HStack align='center' justify="between" fullWidth>
                            <HStack className={s.left} align="center">
                                {styledIcon}
                                <Typo.Body>{link.label}</Typo.Body>
                            </HStack>
                        </HStack>
                    </a>
                )
            })}
        </VStack>
    )
}