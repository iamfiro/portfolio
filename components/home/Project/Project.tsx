import Button from '@/components/ui/Button/Button';
import projects from '@/public/projects/_project.json';

import s from './style.module.scss';

import { MdArrowOutward } from 'react-icons/md';
import ProjectItem from './ProjectItem';
import { ProjectStackType } from './shared';

const Project = () => {
    const projectList = projects.slice(0, 3);
    
	return (
		<section>
			<h1 className={s.title}>프로젝트</h1>
            {projectList.map((project) => (
                <ProjectItem
                    key={project.id}
                    title={project.name}
                    description={project.description}
                    image={project.image}
                    link={`/project/${project.id}`}
                    date={project.date}
                    stack={project.stack as ProjectStackType}
                />
            ))}
			<Button
				variant="secondary"
				size="lg"
				fullWidth
				trailingIcon={<MdArrowOutward size={20} />}
                href='/project'
			>
				프로젝트 더보기
			</Button>
		</section>
	);
};

export default Project;
