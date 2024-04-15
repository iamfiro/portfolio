import style from './style.module.scss';

const BigTitle = () => {
    return (
        <div className={style.container}>
            <h1 className={`${style.title} hover`}>Creative</h1>
            <h1 className={style.title}>Web Developer</h1>
            <h1 className={style.title}>&</h1>
            <h1 className={style.title}>Designer</h1>
            <div className={style.right}>
            hi, i'm FIRO, front-end developer currently studying software at Sunrin Internet High School in  South Korea. not reluctant to learn new technologies and are creating services that people will love and need.
            </div>
        </div>
    )
};

export default BigTitle;