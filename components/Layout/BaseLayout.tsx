import s from './layout.module.scss'

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className={s.main}>
            {children}
        </main>
    )
}