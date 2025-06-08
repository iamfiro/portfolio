import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { Link } from 'lucide-react';

import { HStack, Typo, VStack } from '@/components/ui';
import { color, spacing } from '@/styles/token';
import { ImageBlurBase64 } from '@/constants/image';
import { flexAlign } from '@/components/ui/Flex/shared';

import * as s from './style.css'

interface Props {
	name: string;
	imageSrc: string | StaticImport;
}

export default function CarouselProjectItem({
	name,
	imageSrc,
}: Props) {
	return (
		<VStack className={s.container} gap={spacing.moderate}>
			<Image
				className={s.image}
				src={`/projects/${imageSrc}`}
				alt={name}
				width={800}
				height={450}
				quality={10}
				loading="lazy"
				placeholder="blur"
				blurDataURL={ImageBlurBase64}		
			/>
			<HStack align={flexAlign.center} gap={spacing.tiny}>
				<Typo.Caption className={s.projectName}>{name}</Typo.Caption>
				<Link size={12} color={color.text.secondary} className={s.linkIcon} />
			</HStack>
		</VStack>
	);
};