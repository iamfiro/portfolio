import style from './style.module.scss';
import {Row} from "../index.ts";
import {SocialList} from "../../constant/social.ts";
import { MdArrowUpward } from "react-icons/md";
import {FaGithub, FaInstagram} from "react-icons/fa";
import { IoMailOpenOutline } from "react-icons/io5";

function SocialTitleToIcon(title: string) {
	switch (title) {
		case 'Github':
			return <FaGithub />
		case 'Instagram':
			return <FaInstagram />
		default:
			return <IoMailOpenOutline />;
	}
}

const About = () => {
	return (
		<div className={style.container}>
			<section className={style.socialContainer}>
				<Row className={style.socialSection}>
					<span className={style.socialTitle}>( Social )</span>
				</Row>
				{
					SocialList.map((social, index) => (
						<a href={social.link} target={'_blank'} key={index} className={`${style.socialSection} ${style.socialItem}`} style={{justifyContent: 'space-between'}}>
							<span className={style.socialName}>{SocialTitleToIcon(social.name)} {social.name}</span>
							<span className={style.socialLink}>바로가기 <MdArrowUpward size={21} /></span>
						</a>
					))
				}
			</section>
			<section className={style.aboutContainer}>
				<span className={style.aboutTitle}>About Me</span>
				<Row className={style.aboutContent}>
					<p>
						<span>(About Me)</span>
						프론트엔드 개발자 조성주임 ㅇㅇ 저는 쌈@뽕한 스킬을 가지고 있고 누구든 뿅가는 개발자가 되고 싶어요. 그리고 여러분 제가 무슨 말을 하는지 모르겠는데 일단 그냥 들으세요
						ㅋ
					</p>
				</Row>
			</section>
		</div>
	)
}

export default About;
