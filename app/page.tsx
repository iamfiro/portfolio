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
			</CarouselProject>
		</>
	);
};

export default Page;
