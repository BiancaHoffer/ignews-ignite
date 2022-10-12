import Link from 'next/link';
import { useRouter } from 'next/router';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header() {
  const { pathname } = useRouter();

  return (
    <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
            <img src="/images/logo.svg" alt="ig.news" />
            <nav>
              <Link href='/'>
                <a className={styles.active}>Home</a>
              </Link> 
              <Link href='/posts'>
                <a>Posts</a>
              </Link>  
            </nav>

            <SignInButton />
        </div>
    </header>
  );
}