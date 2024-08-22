import style from './style.module.scss';
import Logo from '../../assets/logo.svg';
import FlowerLogo from '../../assets/flower.tsx';

const Header = () => {
	return (
		<header className={style.container}>
			<div>
				<FlowerLogo className={style.flower} />
				<img src={Logo} alt={'DEVFIRO Logo'} className={style.logo}/>
			</div>
			<div>
				<button className={style.button} ref={buttonRef}>
					<span ref={buttonTextRef}>
						눌러서 메일 보내기
					</span>
				</button>
			</div>
		</header>
	)
};

export default Header;
