import { Flex } from '@creative-kit/react';
import s from './style.module.scss';
import Link from 'next/link';

const BlogRootHero = () => {
    return (
        <section>
            <h1 className={s.title}>배움을 기록하는 공간</h1>
            <Flex className={s.indicate} gap={4}>
                <span className={s.indicate}>by</span>
                <Link href="/" className={s.hyperlink}>조성주</Link>
            </Flex>
        </section>
    );
}

export default BlogRootHero;