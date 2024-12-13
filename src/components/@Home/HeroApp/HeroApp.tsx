'use client'

import style from './HeroApp.module.scss';
import Image from "next/image";
import {useHeroAppContainerAnimation} from "@/components/@Home/HeroApp/HeroApp.hook";

const HeroApp = () => {
    const containerRef = useHeroAppContainerAnimation();

    return (
        <div className={style.wrapper}>
            <div ref={containerRef} className={style.container}>
                <Image
                    src={'/mockup_fresio_left.png'}
                    alt={'2024_프레시오 목업 왼쪽 이미지'}
                    width={'1229'}
                    height={'3086'}
                    className={style.mockup}
                />
                <Image
                    src={'/mockup_fresio_right.png'}
                    alt={'2024_프레시오 목업 오른쪽 이미지'}
                    width={'1229'}
                    height={'3086'}
                    className={style.mockup}
                />
            </div>
        </div>
    )
}

export default HeroApp;