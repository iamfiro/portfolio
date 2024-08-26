import style from './style.module.scss';
import { IoMdArrowUp } from "react-icons/io";
import {Column, Row} from "../index.ts";
import {SocialList} from "../../constant/social.ts";
import EmailIcon from '../../assets/image/svg/email.svg';

const Footer = () => {
	const date = new Date();
	return (
		<>
			<div className={style.wrap}>
				<footer className={style.container}>
					<div className={style.left}>
						<Column className={style.socialContainer}>
							<Row className={style.socialHeader}>
								<span>소셜</span>
								<span>( Social )</span>
							</Row>
							{
								SocialList.map((social, index) => (
									<a href={social.link} key={index} target={'_blank'} className={style.social}>
										{social.name}
										<IoMdArrowUp />
									</a>
								))
							}
						</Column>
						<span className={style.copyright}>© {date.getFullYear()} by DEVFIRO</span>
					</div>
					<div className={style.right}>
						<img src={EmailIcon} alt={'email'} className={style.emailIcon}/>
					</div>
				</footer>
			</div>
		</>
	)
}

export default Footer;
