import { getMonthAndDay } from '@/lib/date';
import s from './style.module.scss';

interface PostListItemProps {
    id: string;
    name: string;
    date: string;
    isOtherItemHovered: boolean;
    onHover: (isHovered: boolean) => void;
}

const PostListItem = ({ id, name, date, isOtherItemHovered, onHover }: PostListItemProps) => {
    return (
        <a 
            href={`/blog/${id}`}
            className={s.postListItem}
            style={{ opacity: isOtherItemHovered ? 0.5 : 1 }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <span className={s.postListItemName}>{name}</span>
            <span className={s.postListItemDate}>{getMonthAndDay(date)}</span>
        </a>
    );
}

export default PostListItem;