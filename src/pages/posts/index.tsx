import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import { asText } from '@prismicio/helpers';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) { 
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={!session?.activeSubscription 
                ? `/posts/preview/${post.slug}` 
                : `/posts/${post.slug}`
              } 
              key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const response = await prismic.getByType('post', {
    fetch: ['post.title', 'post.excerpt'],
    pageSize: 20,
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      excerpt: asText(post.data.excerpt),
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    }
  })

  // console.log(JSON.stringify(posts, null, 2))
  // console.log(JSON.stringify(response, null, 2))

  return {
    props: { 
      posts
    },
    revalidate: 60 * 30, // 30 minutes
  }
}