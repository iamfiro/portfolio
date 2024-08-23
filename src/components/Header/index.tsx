import style from './style.module.scss';
import {useState} from "react";
import Logo from '../../assets/logo_flower.svg';

const Header = () => {
	const [time, setTime] = useState('00:00');

	// 시간 업데이트
	setInterval(() => {
		const date = new Date();
		setTime(`${date.getHours()}:${date.getMinutes()}`);
	}, 1000);

	return (
		<header className={style.container}>
			<span className={style.title}>@devfiro</span>
			<img src={Logo} alt="logo" className={style.logo}/>
			<span className={style.time}>Seoul, Korea {time}</span>
		</header>
	)
};

export default Header;

