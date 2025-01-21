import { AvailableTechStack, humanizeTechStackName } from '@/constants/Project';
import Image from 'next/image';

import s from './style.module.scss';
import { ProjectStackType } from './shared';
import { Flex } from '@creative-kit/react';
import StackIcon from '@/components/ui/StackIcon/StackIcon';

interface ProjectItemProps {
	title: string;
	description: string;
	image: string;
	link: string;
	date: string;
	stack: ProjectStackType;
}

const ProjectItem = (props: ProjectItemProps) => {
	const { title, description, image, link, date, stack } = props;

	return (
		<a href={link} className={s.projectLink}>
			<article className={s.projectItem}>
				<Image
					src={`/projects/${image}`}
					alt={title}
					width={800}
					height={500}
					className={s.projectThumbnail}
				/>
				<Flex direction="column" className={s.projectData}>
					<Flex
						justify="between"
						align="center"
						style={{ marginTop: 20 }}
					>
						<span className={s.projectName}>{title}</span>
						{Array.isArray(stack) ? (
							<Flex gap={8}>
								{stack.map((tech) => (
									<StackIcon
										key={tech}
										iconName={tech}
										size={18}
										showTooltip
										tooltipName={humanizeTechStackName(
											tech,
										)}
									/>
								))}
							</Flex>
						) : (
							<span className={s.techStack}>{stack}</span>
						)}
					</Flex>
					<span className={s.projectDescription}>{description}</span>
				</Flex>
			</article>
		</a>
	);
};

export default ProjectItem;
