
import styles from "@/styles/page.module.scss";
import { BigTitle, Cursor, Header, Motto, RecentProject } from "@/components";

export default function Home() {
	return (
		<main className={styles.main}>
			<Cursor />
            <Header />
			<RecentProject />
			<BigTitle />
			<Motto />
		</main>
	);
}
