import { StaticImageData } from 'next/image';
import style from './style.module.scss';
import Image from 'next/image';
import React from 'react';
import { IoMdArrowUp } from "react-icons/io";

interface ProjectProps {
    name: string;
    image: StaticImageData;
    styles?: React.CSSProperties;
    titleColor?: string;
    href?: string;
}

function Project({ name, image, styles, titleColor = 'var(--color-text)', href }: ProjectProps) {
    return (
        <a href={href} className={style.article} style={styles}>
            <div className={style.top}>
                <span className={style.name} style={{ color: titleColor }}>Project · {name}</span>
                <IoMdArrowUp className={style.arrow} />
            </div>
            <Image src={image} alt={name} className={style.image} />
        </a>
    );
}

export default Project;