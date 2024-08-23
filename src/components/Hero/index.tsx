import style from './style.module.scss';
import { TiWeatherCloudy } from "react-icons/ti";

const Hero = () => {
	return (
		<div className={style.container}>
			<div>
				<ul className={style.href}>
					<li><TiWeatherCloudy size={20} /> 32 °C, Cloudy</li>
				</ul>
			</div>
			<div>
				<span>Clody</span>
				<img src="https://source.unsplash.com/random" alt="hero" className={style.hero}/>
			</div>
		</div>
	)
};

export default Hero;
