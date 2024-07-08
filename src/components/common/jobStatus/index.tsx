import style from './style.module.scss';

function JobStatus() {
    return (
        <div className={style.container}>
            <div className={style.ripple}></div>
            <span className={style.text}>Available for Work</span>
        </div>
    );
}

export default JobStatus;