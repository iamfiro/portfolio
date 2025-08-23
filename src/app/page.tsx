import { FlutedGlass } from '@/components/ui/fluted-glass';
import Header from '@/components/ui/header';

import s from '@/styles/app/page.module.scss';

export default function Home() {
  return (
    <div>
      <Header />
      <div className={s.hero}>
        <div className={s.fluidOverlay}>
          <FlutedGlass />
        </div>
      </div>
    </div>
  );
}
