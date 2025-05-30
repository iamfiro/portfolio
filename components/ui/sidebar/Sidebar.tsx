import { VStack } from "@/components/ui";
import { SidebarHeader } from "@/components/ui/sidebar/parts";

import s from "./style.module.scss";

export default function Sidebar() {
    return (
        <VStack className={s.sidebar}>
            <SidebarHeader />
        </VStack>
    )
}