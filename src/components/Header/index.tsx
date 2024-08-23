import style from './style.module.scss';
import Logo from '../../assets/logo.svg';
import FlowerLogo from '../../assets/flower.tsx';
import {useLayoutEffect, useRef} from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import gsap from 'gsap';

const Header = () => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const buttonTextRef = useRef<HTMLSpanElement>(null);

	useLayoutEffect(() => {
		// GSAP 타임라인 선언
		const tl = gsap.timeline({ paused: true });

		// 텍스트가 올라가면서 사라진 후 아래에서 다시 나타나는 애니메이션
		tl.to(buttonTextRef.current, { duration: 0.2, yPercent: -200 });
		tl.set(buttonTextRef.current, { yPercent: 200 });
		tl.to(buttonTextRef.current, { duration: 0.2, yPercent: 0 });

		// 버튼에 마우스 호버시 애니메이션 실행
		buttonRef.current?.addEventListener('mouseenter', () => {
			/*
			* tl.start() 함수를 사용할 시 애니메이션이 한번만 실행되는 문제가 있어 tl.restart() 함수를 사용한다
			* */
			tl.restart();
		});
		// mouseleave 이벤트를 사용하고 싶지만 tl.reverse() 애니메이션이 제대로 재생되지 않는 버그가 있음
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
						눌러서 메일 보내기 <IoIosArrowRoundForward size={25} />
					</span>
				</button>
			</div>
		</header>
	)
};

export default Header;

