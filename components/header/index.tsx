import style from './style.module.scss';

const Header = () => {
    return (
        <header className={style.container}>
            <h1 className={style.name}>@devfiro</h1>
            <ul className={style.menu}>
                <h1>Menu</h1>
                <a className={style.text}>Project</a>
                <a className={style.text}>Stack</a>
                <a className={style.text}>Social</a>
            </ul>
            <ul className={style.menu}>
                <h1>Contact</h1>
                <a className={style.text} target='_blank' href='https://github.com/iamfiro'>Github</a>
                <a className={style.text} target='_blank' href='https://instagram.com/chxs_u'>Instagram</a>
            </ul>
            <a className={style.email}>( Send a mail )</a>
        </header>
    )
};

export default Header;
