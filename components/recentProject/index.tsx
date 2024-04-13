import Image from 'next/image';
import style from './style.module.scss';
import SampleImage from '@/public/project/sunrin-today.png'
import { IoMdArrowUp } from "react-icons/io";

const RecentProject = () => {
    return (
        <article className={style.container}>
            <a className={`${style.a} hover`} href="">
                <Image src={SampleImage} alt="Project 1"/>
                <div className={style.wrap}>Recent project <IoMdArrowUp /></div>
            </a>
        </article>
    )
};

export default RecentProject;