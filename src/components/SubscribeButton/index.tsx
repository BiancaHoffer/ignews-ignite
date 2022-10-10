import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';
import { getStripePublic } from '../../services/stripe-public';
import { api } from '../../services/api';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status } = useSession();
  
  async function handleSubscribe() {
    if (status === "unauthenticated") {
      signIn('github');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripePublic()

      stripe.redirectToCheckout({ sessionId: sessionId });
      console.log(response.data.sessionId)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <button
        type="button"
        className={styles.subscribeButton}
        onClick={handleSubscribe}
    >
        Subscribe now
    </button>
  );
}