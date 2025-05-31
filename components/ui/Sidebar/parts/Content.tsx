import { Typo, VStack } from "@/components/ui";

import s from './parts.module.scss'

export default function SidebarContent() {
    return (
        <VStack className={s.content}>
            <VStack>
                <Typo.Headline>
                   Hello, I'm Cho sung ju, A Frontend developer.
                </Typo.Headline>
                <Typo.Body className={s.copyright}>© 2025</Typo.Body>
            </VStack>
        </VStack>
    )
}