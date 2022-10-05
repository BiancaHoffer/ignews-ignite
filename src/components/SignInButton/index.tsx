import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import { signIn, useSession, signOut } from 'next-auth/react';

export function SignInButton() {
  const { status, data } = useSession()  
  console.log(data);

  return status === "authenticated" ? (
<   button 
        type="button"
        className={styles.button}
        onClick={() => signOut}
        >
        <FaGithub color="#04d361" />
        Bianca Hoffer
        <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button 
        type="button"
        className={styles.button}
        onClick={() => signIn('github')}
        >
        <FaGithub color="#eba417" />
        Sign in with Github
    </button>
  );
}