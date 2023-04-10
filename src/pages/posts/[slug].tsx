import { GetServerSideProps } from 'next';
import styles from './post.module.scss';

import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next'
import { useState } from 'react'
import { redirect } from 'next/dist/server/api-utils';
import Head from 'next/head';
import Image from 'next/image';

interface PostProps{
    post:{
        slug:string,
        title:string,
        cover:string,
        description:string,
        updatedAt:string,

    }
}

export default function Post({ post }: PostProps){
    return(
       <>
       <Head>
        <title>{post.title}</title>
       </Head>
       <main className={styles.container}>
        <article className={styles.post}>
        <Image
        quality={100}
        src={post.cover}
        alt={post.title}
        height={410}
        width={720}
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkmPa/HgAESQIWlNI/LwAAAABJRU5ErkJggg=="
        placeholder='blur'/> 
        <h1>{post.title}</h1>
        <time>{post.updatedAt}</time>
        <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.description}}></div>
        </article>
       </main>
       </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) =>{
   


    const slug = params ;

    const prismic = getPrismicClient(req);

    const response = await prismic.getByUID('post', String(slug), {})

    if (!response) {
        return {
            redirect:
            {
            destination: '/posts',
            permanent: false
            }   
            }
        }

    const post = {
        slug: slug,
        title: RichText.asText(response.data.title),
        description: RichText.asHtml(response.data.description),
        cover: response.data.cover.url,
        updatedAt: new Date().toLocaleDateString('pt-BR', {
            day:'2-digit',
            month:'long',
            year:'numeric'
        }),
    }
    return{
        props:{
            post
        }
    }
}