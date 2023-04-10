import Prismic from '@prismicio/client'

export function getPrismicClient(req?:unknown){
    const prismic = Prismic.client('https://portifolio-rodrigo.cdn.prismic.io/api/v2', {
        req,
    })
    return prismic;
}