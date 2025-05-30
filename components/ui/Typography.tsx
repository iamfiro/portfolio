import React, { ElementType } from 'react';

import { GeistMono } from '@/lib/font';

type Variant = 'micro' | 'caption' | 'subtext' | 'body' | 'bodyLarge' | 'headline' | 'title';

const styles: Record<Variant, React.CSSProperties> = {
	micro: {fontSize: 10, lineHeight: '14px'},
	caption: {fontSize: 12, lineHeight: '16px'},
	subtext: {fontSize: 14, lineHeight: '20px'},
	body: {fontSize: 16, lineHeight: '24px'},
	bodyLarge: {fontSize: 18, lineHeight: '26px'},
	headline: {fontSize: 24, lineHeight: '32px'},
	title: {fontSize: 32, lineHeight: '40px'},
};

type BaseProps = React.HTMLAttributes<HTMLSpanElement> & {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	as?: ElementType;
};

const Typo: Record<Capitalize<Variant>, React.FC<BaseProps>> = {} as never;

(Object.keys(styles) as Variant[]).forEach((key) => {
	const componentName = key.charAt(0).toUpperCase() + key.slice(1) as Capitalize<Variant>;
	Typo[componentName] = ({style, as: Component = 'span', ...props}) => (
		<Component
			style={{...styles[key], ...style, fontWeight: 300}}
			className={`${props.className ?? ''} ${GeistMono.className}`}
			{...props}
		/>
	);
});

export default Typo;