'use client';

import { getIntersectionObserver } from '@/lib/observer';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import s from './style.module.scss';

const TOC = () => {
	const pathname = usePathname();
	const [currentId, setCurrentId] = useState<string>('');
	const [headingElements, setHeadingElements] = useState<Element[]>([]);

	useEffect(() => {
		const observer = getIntersectionObserver(setCurrentId);
		const headingElementList = Array.from(
			document.querySelectorAll('h2, h3')
		);

		setHeadingElements(headingElementList);

		if (headingElementList.length > 0) {
			setCurrentId(headingElementList[headingElementList.length - 1].id);
		}
		
		headingElementList.forEach((header) => observer.observe(header));

		return () => {
			headingElementList.forEach((header) => observer.unobserve(header));
		};
	}, [pathname]);

	if(!headingElements.length) return null;

	return (
		<div className={s.container}>
			<h1 className={s.title}>On This Page</h1>
			<div className={s.inner}>
				{headingElements.map((header, index) => (
					<div
						key={index}
						className={`${s.item} ${currentId === header.id ? s.active : ''}`}
						data-depth={header.nodeName === 'H2' ? '1' : '2'}
					>
						<a href={`#${header.id}`}>{header.textContent}</a>
					</div>
				))}
			</div>
		</div>
	);
};

export default TOC;
