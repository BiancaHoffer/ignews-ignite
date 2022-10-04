import Head from 'next/head';
import styles from '../styles/home.module.scss';
 
export default function Home() {
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
            <strong>for $9.90 month</strong>
          </p>
        </section>

        <img src="/images/girlCoding.svg" />
      </main>
    </> 
  )
}
