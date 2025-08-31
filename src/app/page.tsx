import { MainLayout } from '@/components/layouts';
import Header from '@/components/ui/header';

export default function Home() {
  return (
    <MainLayout>
      <Header />
      <h1>
        안녕하세요 <img src="/home/wave.gif" alt="wave" />
      </h1>
    </MainLayout>
  );
}
