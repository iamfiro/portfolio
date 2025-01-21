import CarouselProject from '@/components/home/CarouselProject/CarouselProject';
import { Hero } from '@/components/home/Hero';
import { Project } from '@/components/home/Project';
import { Stack } from '@/components/home/Stack';
import HomeLayout from '@/layouts/HomeLayout';

const Page = () => {
	return (
		<>
			<CarouselProject />
			<HomeLayout>
				<Hero />
				<Project />
				<Stack />
			</HomeLayout>
		</>
	);
};

export default Page;
