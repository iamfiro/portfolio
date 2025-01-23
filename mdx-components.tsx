import type { MDXComponents } from 'mdx/types';

import Image from 'next/image';

import s from '@/styles/blog.module.scss';
import Link from 'next/link';

export function MDXComponents(components: MDXComponents): MDXComponents {
	return {
		img: (props) => (
			<Image
				{...props}
				width={1140}
				height={1600}
				className={s.imageComponent}
			/>
		),
		a: (props) => <Link {...props} className={s.link} />,
		...components,
	};
}
