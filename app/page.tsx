import CarouselProject from '@/components/home/CarouselProject/CarouselProject';
import HomeLayout from '@/layouts/HomeLayout';

const Page = () => {
	return (
		<>
			<CarouselProject />
			<HomeLayout>
				<h1>안녕하세요, 프론트엔드 개발자 조성주입니다
현재 선린인터넷고등학교에 재학 중이며
개발에 대한 열정을 가지고 있습니다
사람들에게 도움이 되는 서비스를 만들기 위해 꾸준히 노력하고 있으며
새로운 기술을 배우는 것을 즐깁니다.</h1>
			</HomeLayout>
		</>
	);
};

export default Page;
