import Link from 'next/link'
import parser from 'html-react-parser'
import { findPrimaryCategory } from '../../../../utils/helpers'
import ShareLinks from 'app/app/ob-world/share-links'
import PortraitHeader from 'app/app/[category]/[slug]/portrait-header'
import LandscapeHeader from 'app/app/[category]/[slug]/landscape-header'
import Quote from 'app/app/[category]/[slug]/quote'
import CentralisedImage from 'app/app/[category]/[slug]/centralised-image'
import Text from 'app/app/[category]/[slug]/text-block'
import { cookies } from 'next/headers'

export default async function PreviewBlogPage({
    params
}: {
    params: { id: string }
}) {
    const cookieStore = cookies()
    const authToken = cookieStore.get('authToken')
    const res = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken.value}`
            },
            body: JSON.stringify({
                query: `query getBlogData($id: ID!) {
                            post(id: $id, idType: DATABASE_ID) {
                                title
                                date
                                link
                                acfBlog {
                                    introductionText
                                    author
                                    headerImage {
                                    ... on Post_Acfblog_HeaderImage_Landscape {
                                        fieldGroupName
                                        image {
                                            mediaItemUrl
                                            altText
                                        }
                                    }
                                    ... on Post_Acfblog_HeaderImage_Portrait {
                                        fieldGroupName
                                            image {
                                                altText
                                                mediaItemUrl
                                            }
                                        }
                                    }
                                    thumbnailImage {
                                        altText
                                        mediaItemUrl
                                    }
                                    mainContent {
                                        ... on Post_Acfblog_MainContent_GoldenQuoteBlock {
                                            fieldGroupName
                                            quote
                                        }
                                        ... on Post_Acfblog_MainContent_CentralisedImageBlock {
                                            fieldGroupName
                                            image {
                                                altText
                                                mediaItemUrl
                                                caption
                                            }
                                        }
                                        ... on Post_Acfblog_MainContent_TextBlock {
                                            fieldGroupName
                                            text
                                        }
                                    }
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
                        }`,
                variables: {
                    "id": params.id
                }
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const acfBlog = res?.data?.post?.acfBlog
    const fdate = new Date(res?.data?.post?.date)
    const postDate = `${fdate.toLocaleString("default", { month: "long" })} ${fdate.getDay()}, ${fdate.getFullYear()}`
    const primaryCategory = findPrimaryCategory(res?.data?.post?.categories?.edges)
    const introText = parser('<p>' + acfBlog?.introductionText.slice(4))
    const firstChar = acfBlog?.introductionText.charAt(3)

    return (
        <>
        <section className="pt-5">
        {
            acfBlog?.headerImage[0]?.fieldGroupName === "Post_Acfblog_HeaderImage_Portrait" 
                ? <PortraitHeader image={acfBlog?.headerImage[0]?.image} title={res?.data?.post?.title} author={acfBlog?.author} />
                : <LandscapeHeader image={acfBlog?.headerImage[0]?.image} title={res?.data?.post?.title} author={acfBlog?.author} />
        }   
            <div className="max-w-7xl px-5 pt-12">
                <div className="relative pb-12">
                    <p className="absolute left-0 top-0 text-xs text-[#BA995C]">
                        <Link href="/ob-world/">&lt; BACK TO OB WORLD</Link>
                    </p>
                    <p className="text-center text-[#bdbcbe] pt-12 md:pt-0">{postDate}<span className="mx-2.5">|</span>{primaryCategory}</p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <div className="table w-full">
                        <div className="text-right pr-1 table-cell align-top">
                            <h1 className="relative text-5xl text-[#BA995C] -mt-2 md:-mt-3 md:text-6xl">{firstChar}</h1>
                        </div>
                        <div className="table-cell align-top">{introText}</div>
                    </div>
                </div>
                <div className="text-center py-12">
                    <ShareLinks title={res?.data?.post?.title.replaceAll(' ', '+')} 
                        url={res?.data?.post?.link} 
                        description={parser(acfBlog?.introductionText)} 
                        image={acfBlog?.thumbnailImage?.mediaItemUrl} />
                </div>
            </div>

        {
            acfBlog?.mainContent.map((content: any) => {
                switch (content.fieldGroupName) {
                    case "Post_Acfblog_MainContent_GoldenQuoteBlock": 
                        return <Quote quote={content.quote} />
                    case "Post_Acfblog_MainContent_CentralisedImageBlock": 
                        return <CentralisedImage image={content.image} />
                    case "Post_Acfblog_MainContent_TextBlock": 
                        return <Text text={content.text} />

                }
            })
        }
            
        </section>
        </>
    )
}