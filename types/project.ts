import { StaticImageData } from "next/image";

export interface ProjectProps {
    readonly type: 'project' | 'design';
    readonly name: string;
    readonly image: StaticImageData;
    readonly description: string;
    readonly href: string;
    date?: string;
}
