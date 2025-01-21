import CarouselProject from '@/components/home/CarouselProject/CarouselProject';
import { Hero } from '@/components/home/Hero';
import HomeLayout from '@/layouts/HomeLayout';

const Page = () => {
	return (
		<>
			<CarouselProject />
			<HomeLayout>
				<Hero />
			</HomeLayout>
		</>
	);
};

export default Page;
