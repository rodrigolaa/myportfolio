

import { GetStaticProps } from 'next'
import styles from '../styles/home.module.scss'
import Head from 'next/head'
import { getPrismicClient } from '../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';


type Content ={
  title: string,
  subTitle: string,
  linkAction: string,
  mobileTitle: string,
  mobileContent: string,
  mobileImage: string,
  titleWeb: string,
  webContent: string,
  webImage: string,
}


interface ContentProps{
  content: Content
}

export default function Home({content}: ContentProps) {
  //console.log(content)
  return (
    <>
    <Head >Love tech!/ </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section  className={styles.ctaText}>
            <h1>{content.title}</h1>
            <span>
            {content.subTitle}
            </span>
          <a href={content.linkAction}> 
            <button>
              Start Now
            </button>
          </a>
          </section>
          <img src='/images/banner-conteudos.png'
          alt = 'content portfolio'/>
        </div>
        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}> 
          <section>
            <h2>
            {content.mobileTitle}
            </h2>
            <span>
              {content.mobileContent}
            </span>
          </section>

            <img src={content.mobileImage} alt='content mobiles'/>

        </div>

        <hr className={styles.divisor}/>

        <div className={styles.sectionContent}> 
            <img src = {content.webImage} alt='content web'/>
          <section className={styles.contentMobile}>
            <h2>
            {content.webContent}
            </h2>
            <span>
            Criar sistemas web, sites usando as tecnologias mais modernas e requisitadas pelo mercado.
            </span>
          </section>
        </div>
      </main>
    </>
    
    
    
  )
}

export const getStaticProps: GetStaticProps = async () =>{
  
const prismic = getPrismicClient();
const response = await prismic.query([
  Prismic.Predicates.at('document.type', 'home')
])

//console.log(response.results[0].data)

const {
  title, sub_title, link_action,
  mobile, mobile_content,mobile_image,
  title_web,web_content, web_image,

} = response.results[0].data;

const content = {
  title: RichText.asText(title),
  subTitle: RichText.asText(sub_title),
  linkAction: link_action.url,
  mobileTitle: RichText.asText(mobile),
  mobileContent: RichText.asText(mobile_content),
  mobileImage: mobile_image.url,
  titleWeb: RichText.asText(title_web),
  webContent: RichText.asText(web_content),
  webImage: web_image.url,

}

  return{
    props:{
      content
    },
    revalidate: 60*2 // each 2 min

  }

}