import style from '../styles/page.module.scss';

export default function Home() {
    return (
        <>
		<section className={style.container}>
			<video autoPlay loop muted className={style.video}>
				<source src='/video/background.mp4' type="video/mp4" />
			</video>
		</section>
        </>
    );
}
