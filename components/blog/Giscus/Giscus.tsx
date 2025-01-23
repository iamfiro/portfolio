'use client';

import { useEffect, useRef } from 'react';

export default function Giscus() {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!ref.current || ref.current.hasChildNodes()) return;

		const scriptElem = document.createElement('script');
		scriptElem.src = 'https://giscus.app/client.js';
		scriptElem.async = true;
		scriptElem.crossOrigin = 'anonymous';

		scriptElem.setAttribute('data-repo', 'iamfiro/portfolio');
		scriptElem.setAttribute('data-repo-id', 'R_kgDOLnxpjg');
		scriptElem.setAttribute('data-category', 'Announcements');
		scriptElem.setAttribute('data-category-id', 'DIC_kwDOLnxpjs4CmRhg');
		scriptElem.setAttribute('data-mapping', 'title');
		scriptElem.setAttribute('data-strict', '1');
		scriptElem.setAttribute('data-reactions-enabled', '1');
		scriptElem.setAttribute('data-emit-metadata', '0');
		scriptElem.setAttribute('data-input-position', 'top');
		scriptElem.setAttribute('data-theme', 'light');
		scriptElem.setAttribute('data-lang', 'ko');
        scriptElem.setAttribute('data-loading', 'lazy');

		ref.current.appendChild(scriptElem);
	}, []);

	return <section ref={ref} />;
}
