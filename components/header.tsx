import Image from "next/image";
import Logo from '../public/logo.png';
import ShimmerButton from "./shimmer-button";

export default function Header() {
    return (
        <header className="h-[65px] flex items-center w-full max-w-[1440px] mx-auto px-[15px]">
            <Image src={Logo} width={25} alt="page logo" />
            <span className="ml-2 font-bold text-base">개발자 조성주</span>
            <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
                    Github 바로가기
                </span>
            </ShimmerButton>
        </header>
    )
}