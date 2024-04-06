import { ProjectProps } from "@/types/project"
import Image from 'next/image'
import style from '@/style/page.module.scss'

function Project({ name, image, description }: ProjectProps) {
    return (
        <div className={style.project}>
            <Image src={image} alt={name} />
            <span>{name}</span>
            <span className={style.project_description}>{description}</span>
        </div>
    )
}

export default Project;