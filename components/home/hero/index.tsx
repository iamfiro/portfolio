import { GrArticle } from 'react-icons/gr';
import { Copy } from 'lucide-react';
import Image from 'next/image';

import { Button, HStack, Typo, VStack } from '@/components/ui';
import { spacing } from '@/styles/token';

export default function Hero() {
	return (
		<VStack gap={spacing.moderate} fullWidth>
			<Typo.Headline lineHeight={1.6} weight={400}>
				안녕하세요, 프론트엔드 개발자 조성주입니다. <br />
				저는 현재 선린인터넷고등학교에 재학 중이며, <br />
				개발에 대한 열정으로 끊임없이 성장하고 있습니다. <br />
				사람들에게 도움이 되는 서비스를 만드는 것을 목표로 <br />
				꾸준히 노력하고 있으며, 새로운 기술을 배우고 <br />
				도전하는 것을 즐깁니다.
			</Typo.Headline>
			<VStack gap={spacing.moderate} fullWidth>
				<HStack fullWidth gap={spacing.small}>
					<Button
						leadingIcon={<Copy />}
						href="mailto:hello@devfiro"
						fullWidth
					>
						hello@devfiro.com
					</Button>
					<Button
						leadingIcon={<Image src={'/svg/social/github.svg'} alt="Github" width={20} height={20} />}
						variant={'secondary'}
						href="https://github.com/iamfiro"
					>
						iamfiro
					</Button>
					<Button
						leadingIcon={<Image src={'/svg/social/instagram.svg'} alt="Github" width={18} height={18} />}
						variant={'secondary'}
						href="https://instagram.com/chxs_u"
					>
						chxs_u
					</Button>
				</HStack>
				<Button
					variant="secondary"
					leadingIcon={<GrArticle />}
					href="/blog"
					fullWidth
				>
					블로그 방문하기
				</Button>
			</VStack>
		</VStack>
	);
};
