import { Flex } from '@creative-kit/react'

import s from './style.module.scss'

import { PropsWithChildren } from 'react'
import Image from 'next/image'

const Header = ({ children }: PropsWithChildren) => {
	return (
		<Flex justify="center" direction="row" className={s.container}>
			<header className={s.header}>
				<Image src="/affinityphoto.svg" alt="logo" height={25} width={80} />
				<ul className={s.nav}>
					<li>
						<a href="#">자기소개</a>
					</li>
					<li>
						<a href="#">프로젝트</a>
					</li>
                    <li>
						<a href="#">블로그</a>
					</li>
                    <li>
						<a href="#">활동</a>
					</li>
				</ul>
				<Flex justify="center" align="center" gap={10}>
					<div className={s.hiringCircleAnimation} />
					<span className={s.hiringText}>Available for work</span>
				</Flex>
			</header>
		</Flex>
	)
}

export default Header

//
