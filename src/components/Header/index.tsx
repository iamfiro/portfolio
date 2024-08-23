import style from './style.module.scss';
import {useState, useEffect} from "react";
import Logo from '../../assets/logo_flower.svg';

const Header = () => {
	const [time, setTime] = useState('00:00');
	const [isScrolled, setIsScrolled] = useState(false);

	// 시간 업데이트
	useEffect(() => {
		const interval = setInterval(() => {
			const date = new Date();
			setTime(`${date.getHours()}:${date.getMinutes()}`);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	// 스크롤 감지 및 border-width 변경
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY !== 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<header className={`${style.container}`} style={{ borderBottomWidth: isScrolled ? '0px' : '2px' }}>
			<span className={style.title}>@devfiro</span>
			<img src={Logo} alt="logo" className={style.logo}/>
			<span className={style.time}>Seoul, Korea {time}</span>
		</header>
	);
};

export default Header;
