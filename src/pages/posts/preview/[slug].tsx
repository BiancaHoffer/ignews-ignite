import { useEffect } from 'react'

import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";

import { getSession, useSession } from "next-auth/react";

import { getPrismicClient } from "../../../services/prismic";
import { asHTML } from '@prismicio/helpers';

import styles from '../post.module.scss'
import Link from "next/link";
import Router from "next/router";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updateAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.activeSubscription) {
      Router.push(`/posts/${post.slug}`)
    }
  }, [session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updateAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading?  
            <Link href="/">
              <a> Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const { slug } = params;

  const response = await prismic.getByUID('post', String(slug), {})

  const post = {
    slug,
    title: response.data.title,
    content: asHTML(response.data.content.splice(0, 3)),
    updateAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutos
  }
}