import SunrinToday from '../assets/image/project/sunrin-today.webp';
import SunrinTodayBlack from '../assets/image/project/sunrin-today_black.png';
import NoDream from '../assets/image/project/nodream.png';
import NoDreamBlack from '../assets/image/project/nodream_black.png';
import Watch from '../assets/image/project/watch.webp';
import WatchBlack from '../assets/image/project/watch_black.png';
import LofiStation from '../assets/image/project/lofi.png';
import LofiStationBlack from '../assets/image/project/lofi_black.png';
import NewJeans from '../assets/image/project/newjeans.webp';
import NewJeansBlack from '../assets/image/project/newjeans_black.png';

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
	},
	{
		type: 'project',
		name: '뉴진스 포스터 디자인',
		year: 2023,
		thumbnails: NewJeansBlack,
		thumbnails2: NewJeans,
		href: '/project/newjeans',
	},
	{
		type: 'project',
		name: 'Lofi Station',
		year: 2022,
		thumbnails: LofiStationBlack,
		thumbnails2: LofiStation,
		href: '/project/lofi',
	}
]

export default ProjectList;
