import styles from './styles.module.scss';
import { useSession, signIn } from 'next-auth/react';
import { getStripePublic } from '../../services/stripe-public';
import { api } from '../../services/api';
import Router from 'next/router';

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { status, data: session } = useSession();

  async function handleSubscribe() {
    if (status === "unauthenticated") {
      signIn('github');
      return;
    }

    if (session?.activeSubscription) {
      Router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripePublic()

      stripe.redirectToCheckout({ sessionId: sessionId });
    
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