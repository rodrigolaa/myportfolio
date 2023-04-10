import styles from './styles.module.scss'
import Image from 'next/image'
import logo from '../../../public/images/logo.svg'
import Link from 'next/link'
import { useRouter } from 'next/router';


export default function Header(){

    const {pathname} = useRouter();
    //console.log("the pathname is:", pathname)

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <a>
                    <Image src={logo} alt='Portfolio Logo'></Image>
                </a>
            <nav className={styles.navBar}>
                <Link href='/' className={`${styles.linkNav} ${pathname === '/' ? styles.active : ''}`}>
                    Home
                </Link>
                <Link href='/posts' className={`${styles.linkNav} ${pathname === '/posts' ? styles.active : ''}`}>
                    Content
                </Link>
                <Link href='/about' className={`${styles.linkNav} ${pathname === '/about' ? styles.active : ''}`}>
                    About
                </Link>
            </nav>

            <a className={styles.buttonReady} type='button' href='https://twitter-analysis.vercel.app'>Try Yourself!</a>
            </div>
        </header>
    )
}