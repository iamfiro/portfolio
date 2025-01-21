import CarouselProject from '@/components/home/CarouselProject/CarouselProject';
import { Hero } from '@/components/home/Hero';
import { Stack } from '@/components/home/Stack';
import HomeLayout from '@/layouts/HomeLayout';

const Page = () => {
	return (
		<>
			<CarouselProject />
			<HomeLayout>
				<Hero />
				<Stack />
			</HomeLayout>
		</>
	);
};

export default Page;
