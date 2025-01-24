import s from './style.module.scss';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const Heading = (props: HeadingProps) => {
	return (
		<h1 {...props}>
			<a href={`#${props.id}`} className={`${s.heading} heading`} data-type="heading">
				{props.children}
			</a>
		</h1>
	);
};

export default Heading;
