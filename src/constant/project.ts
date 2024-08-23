export interface Project {
	type: 'project' | 'design' | 'other';
	name: string;
	year: number;
	thumbnails: string;
	thumbnails2: string;
	href: string;
}

export const ProjectList: Project[] = [
	{
		type: 'project',
		name: '선린투데이',
		year: 2024,
		thumbnails: 'https://source.unsplash.com/random/270x170',
		thumbnails2: 'https://source.unsplash.com/random/270x170',
		href: '/project/sunrintoday',
	}
]

export default ProjectList;
