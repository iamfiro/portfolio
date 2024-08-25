import CplusplusIcon from '../assets/stack/cplusplus.svg';
import CypressIcon from '../assets/stack/cypress.svg';
import DiscordIcon from '../assets/stack/discord.svg';
import ElectronIcon from '../assets/stack/electron.svg';
import ExpressIcon from '../assets/stack/express.svg';
import GsapIcon from '../assets/stack/gsap.svg';
import MysqlIcon from '../assets/stack/mysql.svg';
import NextjsIcon from '../assets/stack/nextjs.svg';
import NodejsIcon from '../assets/stack/nodedotjs.svg';
import PostgresqlIcon from '../assets/stack/postgresql.svg';
import PrismaColorIcon from '../assets/stack/prisma-color.svg';
import PythonColorIcon from '../assets/stack/python-color.svg';
import ReactIcon from '../assets/stack/react.svg';
import RecoilColorIcon from '../assets/stack/recoil-color.svg';
import SassIcon from '../assets/stack/sass.svg';
import SolidjsIcon from '../assets/stack/solidjs.svg';
import StorybookIcon from '../assets/stack/storybook.svg';
import StyledComponentsIcon from '../assets/stack/styledcomponents.svg';
import TypescriptIcon from '../assets/stack/typescript.svg';
import NestJsIcon from '../assets/stack/nestjs.svg';
import SocketIcon from '../assets/stack/socketio.svg';

export interface Stack {
	type: 'frontend' | 'backend' | 'etc';
	name: string;
	icon: string;
	description?: string[];
}

export const StackList: Stack[] = [
	{
		type: 'frontend',
		name: 'Next.js',
		icon: NextjsIcon,
	},
	{
		type: 'frontend',
		name: 'React.js',
		icon: ReactIcon,
	},
	{
		type: 'frontend',
		name: 'React Native',
		icon: ReactIcon,
	},
	{
		type: 'frontend',
		name: 'Solid.js',
		icon: SolidjsIcon,
	},
	{
		type: 'frontend',
		name: 'Recoil',
		icon: RecoilColorIcon,
	},
	{
		type: 'frontend',
		name: 'Cypress',
		icon: CypressIcon,
	},
	{
		type: 'frontend',
		name: 'Storybook',
		icon: StorybookIcon,
	},
	{
		type: 'frontend',
		name: 'Sass',
		icon: SassIcon,
	},
	{
		type: 'frontend',
		name: 'Styled Components',
		icon: StyledComponentsIcon,
	},
	{
		type: 'frontend',
		name: 'GSAP',
		icon: GsapIcon,
	},
	// Backend
	{
		type: 'backend',
		name: 'Nest.js',
		icon: NestJsIcon,
	},
	{
		type: 'backend',
		name: 'Node.js',
		icon: NodejsIcon,
	},
	{
		type: 'backend',
		name: 'Express',
		icon: ExpressIcon,
	},
	{
		type: 'backend',
		name: 'MySQL',
		icon: MysqlIcon,
	},
	{
		type: 'backend',
		name: 'PostgreSQL',
		icon: PostgresqlIcon,
	},
	{
		type: 'backend',
		name: 'Prisma',
		icon: PrismaColorIcon,
	},
	{
		type: 'backend',
		name: 'Socket.io',
		icon: SocketIcon,
	},
	{
		type: 'etc',
		name: 'TypeScript',
		icon: TypescriptIcon,
	},
	{
		type: 'etc',
		name: 'C++ (PS)',
		icon: CplusplusIcon,
	},
	{
		type: 'etc',
		name: 'Python',
		icon: PythonColorIcon,
	},
	{
		type: 'etc',
		name: 'Discord.js',
		icon: DiscordIcon,
	},
	{
		type: 'etc',
		name: 'Electron',
		icon: ElectronIcon,
	},
];

export default StackList;
