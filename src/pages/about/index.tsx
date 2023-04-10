import styles from './styles.module.scss'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next'
import { useState } from 'react'
import Head from 'next/head';
import {FiLinkedin, FiGithub} from 'react-icons/fi'

type content = {
    title:string,
    description:string,
    banner:string,
    github:string,
    linkedin:string,
}

interface ContentProps{
    content: content

}

export default function About({ content }: ContentProps){
    return(
        <>
        <Head>
            <title>About us</title>
        </Head>
        <main className={styles.container}> 
            <div className={styles.containerHeader}>
            <section className={styles.ctaText}>
                <h1>{content.title}</h1>
                <p>{content.description}</p>
                <a href={content.github} > <FiGithub size={40}/></a>
                <a href={content.linkedin}><FiLinkedin size={40}/></a>
            </section>
            <img
            src={content.banner}
            alt="profile rodrigo alencar"
            />
            </div>
        </main>
        </>
        
        
    )
}

export const getStaticProps: GetStaticProps = async () =>{
  
    const prismic = getPrismicClient();
    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'about')
    ])
    
    
    const {
      title, 
      description, 
      banner,
      github, 
      linkedin
      
    
    } = response.results[0].data;
    
    const content = {

            title: RichText.asText(title),
            description: RichText.asText(description),
            banner: banner.url,
            github: github.url,
            linkedin: linkedin.url
           
    }
    
      return{
        props:{
          content,
          
        },
        revalidate: 60*30*24*7 // each 30 min

      }
    
}