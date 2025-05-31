import { Divider, VStack } from "@/components/ui";
import SidebarContent from "@/components/ui/Sidebar/parts/Content";
import SidebarHeader from "@/components/ui/Sidebar/parts/Header";
import SidebarSocial from "@/components/ui/Sidebar/parts/Social";
import SidebarHyperlink from "@/components/ui/Sidebar/parts/Hyperlink";
import { HyperLink } from "@/components/ui/Sidebar/shared";
import SidebarRecentBlogFetch from "@/components/ui/Sidebar/parts/RecentBlog";


import s from "./style.module.scss";
import SidebarLocalTime from "./parts/LocalTime";

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
                <SidebarHeader name="Cho sung ju" weather="20°C" />
                <Divider fullWidth />
                <SidebarSocial email="hi@devfiro.com" githubId="iamfiro" instagramId="chxs_u" />
                <Divider fullWidth />
                <SidebarLocalTime location="Korea, Seoul" />
                <Divider fullWidth />
            </VStack>
            <VStack fullWidth fullHeight className={s.content}>
                <SidebarRecentBlogFetch />
                <SidebarContent />
            </VStack>
            <SidebarHyperlink links={hyperlink} />
        </VStack>
    )
}