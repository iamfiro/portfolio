import style from './style.module.scss';

const Header = () => {
    return (
        <header className={style.container}>
            <h1 className={style.name}>@devfiro</h1>
            <ul className={style.menu}>
                <h1>Menu</h1>
                <span style={{ margin: '5px 0', color: 'var(--color-primary)'}}>HYPERLINK</span>
                <a className={style.text}>Project</a>
                <a className={style.text}>Stack</a>
                <a className={style.text}>Social</a>
                <span style={{ margin: '5px 0', color: 'var(--color-primary)'}}>PAGE</span>
                <a className={style.text}>About</a>
                <a className={style.text}>Project</a>
                <a className={style.text}>Blog</a>
            </ul>
            <ul className={style.menu}>
                <h1>Contact</h1>
                <a className={style.text} target='_blank' href='https://github.com/iamfiro'>Github</a>
                <a className={style.text} target='_blank' href='https://instagram.com/tjdwn_.firo'>Instagram</a>
            </ul>
            <a className={style.email}>( Send a mail )</a>
        </header>
    )
};

export default Header;