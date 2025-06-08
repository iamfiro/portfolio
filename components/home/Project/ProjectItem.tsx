
import Image from 'next/image';

import { Flex } from '@/components/ui';
import {StackIcon} from '@/components/stack';
import { humanizeTechStackName } from '@/constants/Projectss';

import s from './style.module.scss';
import { ProjectStackType } from './shared';
import { flexJustify } from '@/components/ui/Flex/shared';

type ProjectMetadata = {
	title: string;
	description: string;
	date: string;
};

type ProjectAsset = {
	image: string;
	link: string;
};

type ProjectTechnology = {
	stack: ProjectStackType;
};

interface ProjectItemProps extends ProjectMetadata, ProjectAsset, ProjectTechnology {}

const ProjectItem = (props: ProjectItemProps) => {
	const { title, description, image, link, stack } = props;

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
						justify={flexJustify.between}
						align="center"
						style={{ marginTop: 20 }}
					>
						<span className={s.projectName}>{title}</span>
						{Array.isArray(stack) ? (
							<Flex gap={8}>
								{/* {stack.map((tech) => (
									<StackIcon
										key={tech}
										iconUrl={tech}
										size={18}
										showTooltip
										tooltipName={humanizeTechStackName(
											tech,
										)}
									/>
								))} */}
								a
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
