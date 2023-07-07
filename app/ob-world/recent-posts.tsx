import Image from 'next/image'
import Link from 'next/link'
import ShareLinks from './share-links'
import { findPrimaryCategory, trimTextToMaxChar } from '../utils/helpers'

export default async function recentPosts({excludePosts, MAXCHARS}) {
    const res2 = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getRecentPosts($excludePosts: [ID]) {
                            posts(first: 4, where: {notIn: $excludePosts}) {
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
                        }`,
                variables: {
                    "excludePosts": excludePosts
                }
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const posts = res2?.data?.posts?.edges
    let postsPrimaryCategory = Array()
    let postsIntroSummary = Array()
    let postsDate = Array()

    for(let post = 0; post < posts.length; post++) {
        postsPrimaryCategory[post] = findPrimaryCategory(posts[post]?.node?.categories?.edges)
        postsIntroSummary[post] = trimTextToMaxChar(posts[post]?.node?.acfBlog?.introductionText, MAXCHARS)

        if(post > 0) {
            const pdate: Date = new Date(posts[post]?.node?.date)
            postsDate[post] = `${pdate.toLocaleString("default", { month: "long" })} ${pdate.getDay()}, ${pdate.getFullYear()}`
        }
    }

    return (
        <>
        <div className="pb-16 px-5" dir="rtl">
            <div className="block lg:table-cell lg:w-3/5" dir="ltr">
                <Link href={posts[0]?.node?.uri}>
                    <Image className="mx-auto" src={posts[0]?.node?.acfBlog?.thumbnailImage?.mediaItemUrl} width="715" height="420" alt={posts[0]?.node?.acfBlog?.thumbnailImage?.altText} />
                </Link>
            </div>
            <div className="align-top block lg:table-cell lg:w-2/5 lg:border-t lg:border-[#d8d6df]" dir="ltr">
                <div className="mt-12 mx-8 lg:max-w-xs">
                    <p className="mb-5 text-xs text-[#bdbcbe] tracking-wider uppercase">
                        Most recent<span className="mx-2.5">|</span><strong>{postsPrimaryCategory[0]}</strong>
                    </p>
                    <Link href={posts[0].node.uri}>
                        <h2 className="mb-5 text-2xl text-[#BA995C] md:text-4xl">{posts[0].node.title}</h2>
                        <p className="mb-5 text-base">{postsIntroSummary[0]}</p>
                    </Link>
                    <p>
                        <ShareLinks title={posts[0]?.node?.title.replaceAll(' ', '+')} url={posts[0]?.node?.link} description={postsIntroSummary[0]} image={posts[0]?.node?.acfBlog?.thumbnailImage?.mediaItemUrl} />
                    </p>
                </div>
            </div>
        </div>

        {
            posts.map((post: any, index: number ) => (
                // skip the first post at index 0
                index === 0 ? null :
                <div className="px-5 pb-8 md:pb-16" key={post?.node?.uri}>
                    <div className="w-1/2 table-cell md:w-[46%]">
                        <Link href={post?.node?.uri}>
                            <Image src={post?.node?.acfBlog?.thumbnailImage?.mediaItemUrl} width="715" height="420" alt={post?.node?.acfBlog?.thumbnailImage?.altText} />
                        </Link>
                    </div>
                    <div className="w-1/2 table-cell align-top border-t border-[#d8d6df] md:w-[54%]">
                        <div className="mt-12 mx-8">
                            <p className="mb-2.5 text-xs text-[#bdbcbe] tracking-wider uppercase md:mb-5">
                                {postsDate[index]}<span className="mx-2.5 hidden md:inline-block">|</span><strong className="hidden md:inline-block">{postsPrimaryCategory[index]}</strong>
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
        </>
    )
}