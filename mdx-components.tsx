import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

import s from '@/styles/blog.module.scss';

import { Heading } from './components/blog/Heading';

export function MDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: (props) => <Heading {...props} className={s.h1} />,
		img: (props) => (
			<Image
				{...props}
				width={560}
				height={320}
				alt={props.alt}
				className={s.imageComponent}
				quality={75} // Add quality attribute for image optimization
				loading="lazy" // Add lazy loading for better performance
			/>
		),
		a: (props) => <Link {...props} className={s.link} />,
		...components,
	};
}