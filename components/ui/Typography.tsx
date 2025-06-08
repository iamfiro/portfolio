import React, { ElementType } from 'react';

type Variant = 'micro' | 'caption' | 'subtext' | 'body' | 'bodyLarge' | 'headline' | 'title';

const styles: Record<Variant, React.CSSProperties> = {
	micro: {fontSize: 10, lineHeight: '14px', fontWeight: 500},
	caption: {fontSize: 12, lineHeight: '16px', fontWeight: 500},
	subtext: {fontSize: 14, lineHeight: '20px', fontWeight: 500},
	body: {fontSize: 16, lineHeight: '24px', fontWeight: 500},
	bodyLarge: {fontSize: 18, lineHeight: '26px'},
	headline: {fontSize: 24, lineHeight: '32px'},
	title: {fontSize: 32, lineHeight: '40px'},
};

type BaseProps = React.HTMLAttributes<HTMLSpanElement> & {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	as?: ElementType;
	weight?: number;
	lineHeight?: number;
};

const Typo: Record<Capitalize<Variant>, React.FC<BaseProps>> = {} as never;

(Object.keys(styles) as Variant[]).forEach((key) => {
	const componentName = key.charAt(0).toUpperCase() + key.slice(1) as Capitalize<Variant>;
	Typo[componentName] = ({style, as: Component = 'span', ...props}) => (
		<Component
			style={{
				...styles[key], 
				...style, 
				fontWeight: props.weight ?? styles[key].fontWeight, 
				fontFamily: 'Pretendard Variable',
				letterSpacing: '.5px',
				lineHeight: props.lineHeight ?? styles[key].lineHeight,
			}}
			className={`${props.className ?? ''}`}
			{...props}
		/>
	);
});

export default Typo;