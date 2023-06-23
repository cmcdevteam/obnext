import Image from 'next/image'
import Link from 'next/link'
import ShareLinks from '../../ob-world/share-links'
import parser from 'html-react-parser'
import {FaCamera} from 'react-icons/fa'
import {SlArrowLeft, SlArrowRight} from 'react-icons/sl'
import LovesGrid from 'app/app/ob-world/ob-loves/loves-grid'

export default async function LovePage({
    params
}: {
    params: { slug: string }
}) {
    const fetchedData = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getLoveData($slug: ID!) {
                            love(id: $slug, idType: SLUG) {
                                title
                                date
                                link
                                databaseId
                                featuredImage {
                                    featuredImage {
                                        altText
                                        caption
                                        mediaItemUrl
                                    }
                                }
                                nextPost {
                                    uri
                                }
                                previousPost {
                                    previousPost {
                                        uri
                                    }
                                }
                            }
                        }`,
                variables: {
                    "slug": params.slug
                }
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const love = fetchedData?.data?.love
    const ldate: Date = new Date(love.date)
    const loveDate = `${ldate.toLocaleString("default", { month: "long" })} ${ldate.getDay()}, ${ldate.getFullYear()}`

    const moreData = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getLovesData($excludeLoveID: [ID]) {
                            loves(first: 14, where: {notIn: $excludeLoveID}) {
                                edges {
                                    node {
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
                        }`,
                variables: {
                    "excludeLoveID": [love.databaseId]
                }
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const loves = moreData?.data?.loves?.edges

    return (
        <>
        <section className="max-w-[1240px] px-10 mx-auto relative">
            <div className="py-5">
                <Link href="/ob-world/" className="text-[#BA995C] text-xs">&lt; Back to ob world</Link>
            </div>
            <div>
                <div className="columns-1 sm:columns-2">
                    <div>
                        <Image width="0" height="0" sizes="100vw" 
                            src={love?.featuredImage?.featuredImage?.mediaItemUrl} 
                            alt={love?.featuredImage?.featuredImage?.altText}
                            className="w-full h-auto" />
                        { love?.featuredImage?.featuredImage?.caption ? 
                            <div className="cw-photographer">
                                <FaCamera size="28" color="#581F5B" className="inline-block"/>
                                <span className="inline-block">{parser(love?.featuredImage?.featuredImage?.caption)}</span>
                            </div>
                            : ''
                        }
                    </div>
                    <div className="px-5">
                        <p className="text-xs text-[#bdbcbe]">{loveDate}</p>
                        <h1 className="text-6xl text-[#BA995C]">{love?.title}</h1>
                        <p className="cw-share">
                            <ShareLinks title={love?.title.replaceAll(' ', '+')} 
                                url={love?.link} 
                                description={love?.title} 
                                image={love?.featuredImage?.featuredImage?.mediaItemUrl} />
                        </p>
                    </div>
                </div>
                {
                    love?.nextPost ? 
                        <Link href={love?.nextPost?.uri} className="absolute z-10 -left-1 top-1/4 inline-block">
                            <SlArrowLeft size={42} color="#BA995C" />
                        </Link>
                    : null
                }
                {
                    love?.previousPost ? 
                        <Link href={love?.previousPost?.previousPost?.uri} className="absolute z-10 -right-1 top-1/4 inline-block">
                            <SlArrowRight size={42} color="#BA995C" />
                        </Link>
                    : null
                }
            </div>

            <div className="max-w-[1240px] mx-auto">
		        <h6 className="text-center text-[#581F5B] text-lg py-10">DISCOVER MORE</h6>
                <LovesGrid loves={loves} />
	        </div>
        </section>
        </>
    )
}