import Image from 'next/image'
import Link from 'next/link'
import ShareLinks from './share-links'
import { findPrimaryCategory, trimTextToMaxChar } from '../utils/helpers'
import { Suspense } from 'react'
import RecentPosts from './recent-posts'

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

    return (
        <section className="max-w-screen-xl mx-auto">
            <Suspense fallback={<div className="text-2xl">Loading...</div>}>
                <RecentPosts excludes={excludePosts} maxchars={MAXCHARS} />
            </Suspense>
            
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
    )
}