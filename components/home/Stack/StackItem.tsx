import { Flex } from '@creative-kit/react';
import s from './style.module.scss';

interface StackItemProps {
    name: string;
    badgeUrl: string;
    description: string[];
}

export const StackItem = ({ name, badgeUrl, description }: StackItemProps) => {
    return (
        <Flex direction="column">
            <img src={badgeUrl} alt={name} height={30} style={{width: 'fit-content'}} />
            <ol className={s.descriptionList}>
                {description.map((desc, i) => (
                    <li key={i}>{desc}</li>
                ))}
            </ol>
        </Flex>
    );
};
