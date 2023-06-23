import Image from 'next/image'
import Link from 'next/link'
import ShareLinks from '../share-links'
import { findPrimaryCategory, trimTextToMaxChar } from '../../utils/helpers'

export const metadata = {
    title: 'Category',
    description: 'Ob World category description Thoughtfully designing and building the world\'s finest homes.',
}

export default async function CategoryPage({
    params
}: {
    params: { category: string }
}) {
    const categoryName = params.category.replace('-', ' ')
    let queryString = ''
    let MAXCHARS = 0
    let posts = null
    let postsIntroSummary = Array()
    let postsDate = Array()
    let postsPrimaryCategory = Array()

    if(params.category === 'view-all') {
        queryString = `query getPosts {
                            page(id: "ob-world", idType: URI) {
                                acfOBWorld {
                                    maxChars
                                }
                            }
                            posts {
                                edges {
                                    node {
                                        title
                                        date
                                        uri
                                        link
                                        acfBlog {
                                            thumbnailImage {
                                                altText
                                                mediaItemUrl
                                            }
                                            introductionText
                                        }
                                        categories {
                                            edges {
                                                isPrimary
                                                node {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }`
    } else {
        queryString = `query getPostsByCategory($slug: String) {
                            page(id: "ob-world", idType: URI) {
                                acfOBWorld {
                                    maxChars
                                }
                            }
                            posts( where: { categoryName: $slug } ) {
                                edges {
                                    node {
                                        title
                                        date
                                        uri
                                        link
                                        acfBlog {
                                            thumbnailImage {
                                                altText
                                                mediaItemUrl
                                            }
                                            introductionText
                                        }
                                    }
                                }
                            }
                        }`
    }

    const fetchedData = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: queryString,
                variables: {
                    "slug": params.category
                }
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    if(params.category === 'ob-loves') {
        posts = fetchedData?.data?.loves?.edges
    } else {
        MAXCHARS = fetchedData?.data?.page?.acfOBWorld?.maxChars
        posts = fetchedData?.data?.posts?.edges

        for(let post = 0; post < posts.length; post++) {
            if(params.category === 'view-all') {
                postsPrimaryCategory[post] = findPrimaryCategory(posts[post]?.node?.categories?.edges)
            }

            postsIntroSummary[post] = trimTextToMaxChar(posts[post]?.node?.acfBlog?.introductionText, MAXCHARS)
            const pdate: Date = new Date(posts[post]?.node?.date)
            postsDate[post] = `${pdate.toLocaleString("default", { month: "long" })} ${pdate.getDay()}, ${pdate.getFullYear()}`
        }
    }

    return (
        <>
        <section>
        {
            posts.map((post: any, index: number ) => (
                <div className="px-5 pb-8 md:pb-16" key={post?.node?.uri}>
                    <div className="w-1/2 table-cell md:w-[46%]">
                        <Link href={post?.node?.uri}>
                            <Image src={post?.node?.acfBlog?.thumbnailImage?.mediaItemUrl} width="715" height="420" alt={post?.node?.acfBlog?.thumbnailImage?.altText} />
                        </Link>
                    </div>
                    <div className="w-1/2 table-cell align-top border-t border-[#d8d6df] md:w-[54%]">
                        <div className="mt-12 mx-8">
                            <p className="mb-2.5 text-xs text-[#bdbcbe] tracking-wider uppercase md:mb-5">
                                {postsDate[index]}<span className="mx-2.5 hidden md:inline-block">|</span>
                                <strong className="hidden md:inline-block">{params.category === 'view-all' ? postsPrimaryCategory[index] : categoryName}</strong>
                            </p>
                            <Link href={post.node.uri}>
                                <h2 className="text-2xl text-[#BA995C] md:text-4xl md:mb-5">{post?.node?.title}</h2>
                                <p className="mb-5 text-base hidden md:block">{postsIntroSummary[index]}</p>
                            </Link>
                            <p className="hidden md:block">
                                <ShareLinks title={post?.node?.title.replaceAll(' ', '+')} url={post?.node?.link} description={postsIntroSummary[index]} image={post?.node?.acfBlog?.thumbnailImage?.mediaItemUrl} />
                            </p>
                        </div>
                    </div>
                </div>
            ))
        }
        </section>
        </>
    )
}