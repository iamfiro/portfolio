import s from './style.module.scss';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className={s.main}>{children}</main>;
}
