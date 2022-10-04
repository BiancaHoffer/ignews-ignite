import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
  const isAuthenticated = true; 
    
  return isAuthenticated ? (
<   button 
        type="button"
        className={styles.button}
        >
        <FaGithub color="#04d361" />
        Bianca Hoffer
        <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button 
        type="button"
        className={styles.button}
        >
        <FaGithub color="#eba417" />
        Sign in with Github
    </button>
  );
}