import style from './style.module.scss';
import Logo from '../../assets/logo.svg';
import FlowerLogo from '../../assets/flower.tsx';
import {useLayoutEffect, useRef} from "react";
import { LuMail } from "react-icons/lu";
import gsap from 'gsap';

const Header = () => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonTextRef = useRef<HTMLSpanElement>(null);

	useLayoutEffect(() => {
		const tl = gsap.timeline({ paused: true });

		tl.to(buttonTextRef.current, { duration: 0.2, yPercent: -150 });
		tl.set(buttonTextRef.current, { yPercent: 150 });
		tl.to(buttonTextRef.current, { duration: 0.2, yPercent: 0 });

		buttonRef.current?.addEventListener('mouseenter', () => {
			tl.restart();
		})
	}, []);

	return (
		<header className={style.container}>
			<div>
				<FlowerLogo className={style.flower} />
				<img src={Logo} alt={'DEVFIRO Logo'} className={style.logo}/>
			</div>
			<div>
				<button className={style.button} ref={buttonRef}>
					<span ref={buttonTextRef}>
						<LuMail /> 눌러서 메일 보내기
					</span>
				</button>
			</div>
		</header>
	)
};

export default Header;
