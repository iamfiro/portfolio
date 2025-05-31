import { Sun } from 'lucide-react';

import { HStack, Typo } from '@/components/ui';

import s from './parts.module.scss';

type Props = {
    name: string;
    weather: string;
}

export default function SidebarHeader({ name, weather }: Props) {
    return (
        <header className={s.header}>
            <HStack align='center' className={s.title}>
                <svg width={12} height={12}>
                    <circle cx={6} cy={6} r={6} fill='#000' className={s.circle} />
                </svg>
                <Typo.Body as='h1' className={s.name}>{name}</Typo.Body>
            </HStack>
            <HStack align='center' className={s.weather}>
                <Sun size={18} />
                <Typo.Subtext>{weather}</Typo.Subtext>
            </HStack>
        </header>
    )
}