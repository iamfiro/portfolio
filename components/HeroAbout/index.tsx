import { TextReval } from '..';
import style from './style.module.scss';

function HeroAbout() {
    return (
        <>
        <section className={style.container}>
            <div>
                <TextReval text="안녕하세요" />
            </div>
        </section>
        </>
    );
}

export default HeroAbout;