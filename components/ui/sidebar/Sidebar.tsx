import { Divider, VStack } from "@/components/ui";

import SidebarHeader from "@/components/ui/sidebar/parts/Header";
import SidebarSocial from "@/components/ui/sidebar/parts/Social";
import SidebarHyperlink from "@/components/ui/sidebar/parts/Hyperlink";

import { HyperLink } from "@/components/ui/sidebar/shared";

import s from "./style.module.scss";

const hyperlink: HyperLink[] = [
    {
        href: '/',
        label: 'Home',
        icon: 'Home'
    },
    {
        href: '/blog',
        label: 'Blog',
        icon: 'Rss'
    },
    {
        href: '/projects',
        label: 'Projects',
        icon: 'FolderKanban'
    },
    {
        href: '/career',
        label: 'Career',
        icon: 'BriefcaseBusiness'
    }
]

export default function Sidebar() {
    return (
        <VStack className={s.sidebar} justify="between">
            <VStack fullWidth>
                <SidebarHeader />
                <Divider fullWidth />
                <SidebarSocial />
                <Divider fullWidth />
            </VStack>
            <VStack fullWidth fullHeight>
                a
            </VStack>
            <SidebarHyperlink links={hyperlink} />
        </VStack>
    )
}