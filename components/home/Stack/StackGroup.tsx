import s from './style.module.scss';
import { StackItem } from './StackItem';

interface StackGroupProps {
    name: string;
    stacks: Array<{
        name: string;
        badgeUrl: string;
        description: string[];
    }>;
}

export const StackGroup = ({ name, stacks }: StackGroupProps) => {
    return (
        <div>
            <h2 className={s.subTitle}>{name}</h2>
            <div className={s.stackWrapper}>
                {stacks.map((stack, i) => (
                    <StackItem
                        key={i}
                        name={stack.name}
                        badgeUrl={stack.badgeUrl}
                        description={stack.description}
                    />
                ))}
            </div>
        </div>
    );
};
