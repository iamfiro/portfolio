import { Typo, HStack, TimeDisplay } from "@/components/ui";

import s from './parts.module.scss'

type Props = {
    location: string;
}

export default function SidebarLocalTime({ location }: Props) {
    return (    
        <HStack className={s.time}>
            <TimeDisplay />
            <Typo.Subtext>{location}</Typo.Subtext>
        </HStack>
    )
}