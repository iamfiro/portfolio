import SunrinToday from '../assets/image/sunrin-today.webp';
import SunrinTodayBlack from '../assets/image/sunrin-today_black.png';
import NoDream from '../assets/image/nodream.png';
import NoDreamBlack from '../assets/image/nodream_black.png';
import Watch from '../assets/image/watch.webp';
import WatchBlack from '../assets/image/watch_black.png';

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
		name: '노드림 Nodream',
		year: 2024,
		thumbnails: NoDreamBlack,
		thumbnails2: NoDream,
		href: '/project/nodream',
	},
	{
		type: 'project',
		name: '선린투데이',
		year: 2024,
		thumbnails: SunrinTodayBlack,
		thumbnails2: SunrinToday,
		href: '/project/sunrintoday',
	},
	{
		type: 'design',
		name: '스마트 워치 디자인 - WatchOS',
		year: 2024,
		thumbnails: WatchBlack,
		thumbnails2: Watch,
		href: '/project/watch',
	}
]

export default ProjectList;
