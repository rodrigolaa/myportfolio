import  Link  from 'next/link'
import styles from './styles.module.scss'
import Head from 'next/head'
import Image from 'next/image'
import { FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi'
import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom';
import { GetStaticProps } from 'next'
import { useState } from 'react'


type Post ={
    title: string,
    slug: string,
    cover: string,
    description: string,
    updatedAt: string,

  }
  
  
  interface PostsProps{
    posts: Post[];
    page: string;
    total_page: string;
  }

export default function Posts({posts: postsBlog, page, total_page} : PostsProps){

    //console.log(posts);

    const [posts, setPosts] = useState(postsBlog || [])

    const [currentPage, setCurrentPage] = useState(Number(page))

    async function reqPost(pageNumber: number){

        const prismic = getPrismicClient();

        const response = await prismic.query([
            Prismic.Predicates.at('document.type', 'post')
        ],
        {
            orderings: '[document.last_publication_date desc]',
            fetch: ['post.title', 'post.description', 'post.cover'] ,
            pageSize: 3,// most recent posts
            page: String(pageNumber)
            })

            return response;
    }

    async function navigatePage(pageNumber: number){
        
        const response = await reqPost(pageNumber)

        if(response.results.length === 0) {
            return ''
        }

        const getPosts = response.results.map( post => {
            return{
                slug: String(post.uid),
                title: RichText.asText(post.data.title),
                description: post.data.description.find((content: { type: string }) => content.type === 'paragraph')?.text??'',
                cover: post.data.cover.url,
                updatedAt: new Date().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                })
            }
        })
        
        setCurrentPage(pageNumber);
        setPosts(getPosts);
    }

    return(
        <>
        <Head>Blog Personal Projects</Head>
        <main className={styles.container}>
        <div className={styles.posts}>

         {posts.map(post => (

            <Link href={`/posts/${post.slug}`} key={post.slug}> 
            <Image src={post.cover} alt={post.title}
            height={410}
            width={720}
            quality={100}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkmPa/HgAESQIWlNI/LwAAAABJRU5ErkJggg=="
            placeholder='blur'/> 
            <strong>{post.title}</strong>
            <time>{post.updatedAt}</time>
            <p>{post.description}</p>
            </Link>   

         ))}

        <div className={styles.buttonNavigate}>
            { Number(currentPage) >= 2 && (
                <div>
                <button onClick={ () => navigatePage(1) }>
                    <FiChevronsLeft size={25} color='#fff'/>

                </button>

                <button onClick={ () => navigatePage(Number(currentPage - 1)) }>
                    <FiChevronLeft size={25} color='#fff'/>
                    
                </button>
            </div>
            )}
            {Number(currentPage) < Number(total_page) && (
                <div>
                <button onClick={ () => navigatePage(Number(currentPage + 1)) }>
                    <FiChevronsRight size={25} color='#fff'/>

                </button>

                <button onClick={ () => navigatePage(Number(total_page)) }>
                    <FiChevronRight size={25} color='#fff'/>
                    
                </button>
            </div>
            )}
        </div>
         </div>

        </main>
        
        </>
    )
}

export const getStaticProps: GetStaticProps = async () =>{
  
    const prismic = getPrismicClient();
    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
        orderings: '[document.last_publication_date desc]',
        fetch: ['post.title', 'post.description', 'post.cover'] ,
        pageSize: 3// most recent posts
    })
    
    //console.log(response.results[0].data)
    
    const {
      title, sub_title, link_action,
      mobile, mobile_content,mobile_image,
      title_web,web_content, web_image,
    
    } = response.results[0].data;
    
    const posts = response.results.map( post => {
        return{
            slug: post.uid,
            title: RichText.asText(post.data.title),
            description: post.data.description.find((content: { type: string }) => content.type === 'paragraph')?.text??'',
            cover: post.data.cover.url,
            updatedAt: new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })
    console.log(response.total_pages)
    
      return{
        props:{
          posts,
          page:response.page,
          total_page: response.total_pages
        },
        revalidate: 60*30 // each 30 min

      }
    
    }