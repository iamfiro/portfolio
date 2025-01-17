import CarouselProject from '@/components/home/CarouselProject/CarouselProject';

const Page = () => {
	return (
		<>
			<CarouselProject>
				<CarouselProject.Item
					name="TAPIE 웹사이트 리브랜딩"
					stack={['react', 'nextjs']}
					imageSrc="/a.png"
				/>
                <CarouselProject.Item
					name="프레시오"
					stack={['react', 'nextjs']}
					imageSrc="/projects/fresio/onboard_main.png"
				/>
                <CarouselProject.Item
					name="프레시오"
					stack={['react', 'nextjs']}
					imageSrc="/projects/fresio/onboard_timer.png"
				/>
                <CarouselProject.Item
					name="프레시오"
					stack={['react', 'nextjs']}
					imageSrc="/projects/fresio/onboard_diet.png"
				/>
                <CarouselProject.Item
					name="프레시오"
					stack={['react', 'nextjs']}
					imageSrc="/projects/fresio/setting.png"
				/>
			</CarouselProject>
		</>
	);
};

export default Page;
