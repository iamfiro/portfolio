import { Award } from '@/components/home/Award';
import { Hero } from '@/components/home';
import { Project } from '@/components/home/Project';
import { Stack } from '@/components/home/Stack';
import { CarouselProject } from '@/components/project';
import { Footer } from '@/components/layout/Footer';
import HomeLayout from '@/components/layout/HomeLayout';

const Page = () => {
	return (
		<>
			<CarouselProject />
			<HomeLayout>
				<Hero />
				<Project />
				<Award />
				<Stack />
				<Footer />
			</HomeLayout>
		</>
	);
};

export default Page;
