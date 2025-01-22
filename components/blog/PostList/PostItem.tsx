import { Flex } from '@creative-kit/react';
import s from './style.module.scss';

interface PostListItemProps {
    name: string;
    date: string;
    isOtherItemHovered: boolean;
    onHover: (isHovered: boolean) => void;
}

const PostListItem = ({ name, date, isOtherItemHovered, onHover }: PostListItemProps) => {
    return (
        <a 
            className={s.postListItem}
            style={{ opacity: isOtherItemHovered ? 0.5 : 1 }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <span className={s.postListItemName}>{name}</span>
            <span className={s.postListItemDate}>{date}</span>
        </a>
    );
}

export default PostListItem;