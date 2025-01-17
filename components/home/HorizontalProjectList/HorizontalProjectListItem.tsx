import { Flex } from '@creative-kit/react'
import s from './style.module.scss'
import TestImage from '@/public/a.png'
import Image from 'next/image'

interface HorizontalProjectListItemProps {}

const HorizontalProjectListItem = ({}: HorizontalProjectListItemProps) => {
	return (
		<Flex justify="start" direction="column" className={s.container} gap={14}>
			<Image
                className={s.image}
				src={TestImage}
				alt="Project Image"
				height={500}
				width={undefined}
			/>
            <span>TAPIE 웹사이트 브랜딩</span>
		</Flex>
	)
}

export default HorizontalProjectListItem
