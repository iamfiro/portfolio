import { Rss } from "lucide-react";

import { BlogLinkCard } from "@/components/Blog";

import s from "./parts.module.scss";

export default function SidebarRecentBlogFetch() {
    return (
        <div className={s.recentBlog}>
            <BlogLinkCard href="/blog/2025/05/31/superconductors" title="상온 초전도체 연구 논문" category={{
                name: 'Recent Posts',
                icon: <Rss size={14} />
            }} />
        </div>
    )
}