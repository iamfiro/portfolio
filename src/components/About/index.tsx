import style from './style.module.scss';
import {Row} from "../index.ts";
import {SocialList} from "../../constant/social.ts";
import { MdArrowUpward } from "react-icons/md";
import {FaGithub, FaInstagram} from "react-icons/fa";

function SocialTitleToIcon(title: string) {
	switch (title) {
		case 'Github':
			return <FaGithub />
		case 'Instagram':
			return <FaInstagram />
		default:
			return title;
	}
}

const About = () => {
	return (
		<div className={style.container}>
			<section className={style.socialContainer}>
				<Row className={style.socialSection}>
					<span className={style.socialTitle}>소셜미디어 ( Social )</span>
				</Row>
				{
					SocialList.map((social, index) => (
						<Row key={index} className={style.socialSection} style={{justifyContent: 'space-between'}}>
							<span className={style.socialName}>{SocialTitleToIcon(social.name)} {social.name}</span>
							<a href={social.link} className={style.socialLink}>바로가기 <MdArrowUpward size={20} /></a>
						</Row>
					))
				}
			</section>
		</div>
	)
}

export default About;
