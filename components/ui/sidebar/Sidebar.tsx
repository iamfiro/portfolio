import { VStack } from "@/components/ui";
import { SidebarHeader, SidebarHyperlink } from "@/components/ui/sidebar";
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
        <VStack className={s.sidebar}>
            <SidebarHeader />
            <SidebarHyperlink links={hyperlink} />
        </VStack>
    )
}