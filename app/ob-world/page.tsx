import Image from 'next/image'
import Link from 'next/link'
import ShareLinks from './share-links'
import { findPrimaryCategory, trimTextToMaxChar } from '../utils/helpers'

export default async function OBWorldPage() {
    const res1 = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getFeaturedPosts {
                            loves(first: 3) {
                                edges {
                                    node {
                                        title
                                        uri
                                        featuredImage {
                                            featuredImage {
                                                altText
                                                mediaItemUrl
                                            }
                                        }
                                    }
                                }
                            }
                            page(id: "ob-world", idType: URI) {
                                acfOBWorld {
                                    maxChars
                                    fullImageFeaturedBlog {
                                        ... on Post {
                                            id
                                            title
                                            date
                                            uri
                                            link
                                            acfBlog {
                                                headerImage {
                                                    __typename
                                                    ... on Post_Acfblog_HeaderImage_Landscape {
                                                        image {
                                                            altText
                                                            mediaItemUrl
                                                        }
                                                    }
                                                    ... on Post_Acfblog_HeaderImage_Portrait {
                                                        image {
                                                            altText
                                                            mediaItemUrl
                                                        }
                                                    }
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
                                    fullTextFeaturedBlog {
                                        ... on Post {
                                            id
                                            title
                                            date
                                            uri
                                            link
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
                                    patternImage {
                                        altText
                                        mediaItemUrl
                                    }
                                }
                            }
                        }`
                    }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const loves = res1?.data?.loves?.edges
    const acfOBWorld = res1?.data?.page?.acfOBWorld
    const MAXCHARS = acfOBWorld?.maxChars
    const featuredImageBlog = acfOBWorld?.fullImageFeaturedBlog[0]
    const featuredImage = featuredImageBlog?.acfBlog?.headerImage[0]?.image
    let fdate = new Date(featuredImageBlog?.date)
    const featuredImagePostDate = `${fdate.toLocaleString("default", { month: "long" })} ${fdate.getDay()}, ${fdate.getFullYear()}`
    const featuredImagePostPrimaryCategory = findPrimaryCategory(featuredImageBlog?.categories?.edges)
    const featuredImagePostIntroText = trimTextToMaxChar(featuredImageBlog?.acfBlog?.introductionText, MAXCHARS)
    const featuredTextBlog = acfOBWorld?.fullTextFeaturedBlog[0]
    const featuredTextPostPrimaryCategory = findPrimaryCategory(featuredTextBlog?.categories?.edges)
    fdate = new Date(featuredTextBlog?.date)
    const featuredTextPostDate = `${fdate.toLocaleString("default", { month: "long" })} ${fdate.getDay()}, ${fdate.getFullYear()}`
    const excludePosts = Array(featuredImageBlog?.id, featuredTextBlog?.id)

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
        <section className="max-w-screen-xl mx-auto">
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

            <div className="relative">
                <div>
                    <Link href={featuredImageBlog?.uri}>
                        <Image src={featuredImage?.mediaItemUrl} alt={featuredImage?.altText} width="1024" height="576" className="w-full" />
                    </Link>
                </div>
                <div className="z-10 relative max-w-3xl mx-auto -mt-[8%] px-10 pb-12">
                    <div className="bg-white">
                        <div className="max-w-md text-center mx-auto py-12">
                            <p className="mb-2.5 text-xs text-[#bdbcbe] tracking-wider uppercase md:mb-5">
                                {featuredImagePostDate}<span className="mx-2.5 inline-block">|</span><strong className="inline-block">{featuredImagePostPrimaryCategory}</strong>
                            </p>
                            <Link href={featuredImageBlog?.uri}>
                                <h2 className="text-2xl text-[#BA995C] md:text-4xl mb-5">{featuredImageBlog?.title}</h2>
                                <p className="mb-5 text-base hidden md:block">{featuredImagePostIntroText}</p>
                            </Link>
                            <p>
                                <ShareLinks title={featuredImageBlog?.title} url={featuredImageBlog?.link} description={featuredImagePostIntroText} image={featuredImage?.mediaItemUrl} />
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-12">
		        <div className="h-16">
                    <Image className="w-full mx-auto h-16" src={acfOBWorld?.patternImage?.mediaItemUrl} alt={acfOBWorld?.patternImage?.altText} width="1400" height="64" />
                </div>
				<div className="max-w-7xl px-2.5 mx-auto">
                    <h6 className="text-lg text-[#581F5B] tracking-[.25em] font-semibold text-center py-10">OB LOVES</h6>
                    <ul className="table">
                    {   loves?.map((love) => (
                            <li className="float-left pb-5 w-1/2 md:w-1/3 md:pb-0" key={love?.node?.uri}>
                                <div className="px-2.5 text-center">
                                    <Link href={love?.node?.uri}>
                                        <Image src={love?.node?.featuredImage?.featuredImage?.mediaItemUrl} 
                                            alt={love?.node?.featuredImage?.featuredImage?.altText} 
                                            width="300" height="300" className="pb-0 md:pb-5"/>
                                        <p className="hidden text-sm text-[#581f5b] font-semibold pb-5 md:block">OB LOVES</p>
                                        <h3 className="hidden text-2xl text-[#ba995c] md:block">{love?.node?.title}</h3>
                                    </Link>
                                </div>
                            </li>
                        ))
                    }
                    </ul>
                </div>
			</div>

            <div className="bg-[#f3f2f0] px-5">
                <div className="max-w-5xl mx-auto text-center py-10">
                    <p className="mb-2.5 text-xs text-[#bdbcbe] tracking-wider uppercase md:mb-5">
                        {featuredTextPostDate}<span className="mx-2.5 inline-block">|</span><strong className="inline-block">{featuredTextPostPrimaryCategory}</strong>
                    </p>
                    <Link href={featuredTextBlog?.uri}>
                        <h2 className="text-2xl text-[#BA995C] md:text-4xl mb-5">{featuredTextBlog?.title}</h2>
                    </Link>
                </div>
            </div>
        </section>
        </>
    )
}