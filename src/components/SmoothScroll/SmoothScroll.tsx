'use client'

import {ReactNode, useEffect} from "react";
import LocomotiveScroll from 'locomotive-scroll';

const SmoothScroll = ({children}: { children: ReactNode }) => {
	useEffect(() => {
		if(typeof window === 'undefined' || !document) return;

		const scroll = new LocomotiveScroll({
			el: document.querySelector('body') as HTMLBodyElement,
			smooth: true
		});

		return () => {
			scroll.destroy();
		};
	}, []);

	return children;
}

export default SmoothScroll;