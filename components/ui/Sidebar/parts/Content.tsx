import { Typo, VStack } from "@/components/ui";

import s from './parts.module.scss'

export default function SidebarContent() {
    return (
        <VStack className={s.content}>
            <VStack>
                <Typo.Headline>
                   안녕하세요, 프론트엔드 개발자 조성주입니다. 사용자에게 도움이 되는 서비스를 만들고, 끊임없이 새로운 기술을 탐구하며 성장하고 있습니다
                </Typo.Headline>
                <Typo.Body className={s.copyright}>© 2025</Typo.Body>
            </VStack>
        </VStack>
    )
}