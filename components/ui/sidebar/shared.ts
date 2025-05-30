export interface HyperLink {
    href: string;
    label: string;
    icon?: string;
}

export interface SidebarHyperlinkProps {
    links: HyperLink[];
}