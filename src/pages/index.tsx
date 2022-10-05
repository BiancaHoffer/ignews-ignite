import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { SubscribeButton } from '../components/SubscribeButton';
import styles from '../styles/home.module.scss';
import stripe from '../services/stripe';
 
interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <p >👏 Hey, welcome</p>
          <strong className={styles.title}>
            News about 
            <br /> the <span>React</span> world.
          </strong>
          <p className={styles.subtitle}> 
            Get access to all the publications <br />
            <strong>for {product.amount} month</strong>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/girlCoding.svg" />
      </main>
    </> 
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1LpKkyBMpmIkB5igObRkF2lJ', {
    expand: ['product']
  })

  const product = {
    priceId: price.id, 
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format((price.unit_amount / 100)), 
  }

  console.log(product.priceId)

  return {
    props: {
      product
    }
  }
}
