import style from './MaxWidth.module.css';
import {ReactNode} from "react";

const MaxWidth = ({ children }: {children: ReactNode}) => {
    return <div className={style.maxWidth}>{children}</div>;
}

export default MaxWidth;