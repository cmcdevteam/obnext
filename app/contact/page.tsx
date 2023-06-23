import Image from 'next/image'
import Link from 'next/link'
import parser from 'html-react-parser'
import { GrFacebookOption, GrTwitter } from 'react-icons/gr'
import { FaPinterestP, FaLinkedinIn, FaInstagram } from 'react-icons/fa'
import { TfiEmail } from 'react-icons/tfi'

export default async function ContactPage() {
    const res = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getContentData {
                            page(id: "contact", idType: URI) {
                                title
                                acfContact {
                                    heroImage {
                                        altText
                                        mediaItemUrl
                                    }
                                    thumbnail {
                                        altText
                                        mediaItemUrl
                                    }
                                    title1
                                    bodycopy1
                                    mapImage {
                                        altText
                                        mediaItemUrl
                                    }
                                    mapTitle
                                    mapAddress
                                    bannnerFullwidthImageVideo {
                                        __typename
                                        ... on Page_Acfcontact_BannnerFullwidthImageVideo_Image {
                                            image {
                                                altText
                                                mediaItemUrl
                                            }
                                        }
                                        ... on Page_Acfcontact_BannnerFullwidthImageVideo_Video {
                                            video {
                                                mediaItemUrl
                                            }
                                        }
                                    }
                                    info
                                    title2
                                    bodycopy2
                                }
                            }
                        }`
            }),
            next: { revalidate: 10 },
        }).then((res) => res.json())

    const acfContact = res?.data?.page?.acfContact

    return (
        <>
            <section>
                <div className="w-full h-96 relative">
                    <Image
                        priority
                        fill
                        src={ acfContact.heroImage.mediaItemUrl }
                        alt={ acfContact.heroImage.altText }
                        className='object-cover'
                    />
                    
                    <div className="absolute top-1/2 -translate-y-2/4 w-full">
                        <h1 className="text-7xl md:text-8xl uppercase text-white text-center max-w-2xl mx-auto">{ res.data.page.title }</h1>
                    </div>
                </div>
            </section>

            <section>
                <div className="md:pt-36 py-16 max-w-7xl mx-auto">
                    <div className="relative">
                        <div className="md:ml-[34%]">
                            <div className="relative ">
                                <Image src={ acfContact.thumbnail.mediaItemUrl } 
                                    alt={ acfContact.thumbnail.altText } 
                                    width="0"
                                    height="0"
                                    sizes="100vw"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                        <div className="bg-stone-200/[0.65] md:absolute md:-top-16 md:left-0 md:mr-[56%]">
                            <div className="relative">
                                <div className="p-8 lg:p-16">
                                    <h1 className="text-5xl md:text-7xl text-yellow-600 pb-5">{ acfContact.title1 }</h1>
                                    <div>
                                        { parser( acfContact.bodycopy1 ) }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="relative">
                    { acfContact.bannnerFullwidthImageVideo.map(( content ) => (
                        content.__typename == "Page_Acfcontact_BannnerFullwidthImageVideo_Image" ? // content is an image
                            <div key="image" className="relative h-[28rem]">
                                <Image src={ content.image.mediaItemUrl } fill style={{ objectFit: 'cover' }}
                                    alt={ content.image.altText } className="h-auto" />
                            </div>
                        : // otherwise content is video
                            <div key="video" className="cw-components comp_VideoBanner2">
                                <div className="videocontainer">
                                    <video loop muted autoplay playsinline poster="" className="preventRightClick">
                                        <source src={content.video.mediaItemUrl} type="video/mp4" />
                                        Your browser does not support HTML5 video.
                                    </video>
                                    <Image src="/assets/img/transparent_1600x600.png" 
                                        width="1600" height="600"
                                        alt="" className="bg-transparent" />
                                </div>
                            </div>
                    ))}
                    <div className="z-10 relative max-w-3xl m-auto -mt-[8%] px-5 pb-5">
                        <div className='relative bg-white'>
                            <div className="max-w-md text-center m-auto px-5 py-12 relative">
                                <h1 className="text-5xl md:text-7xl text-yellow-600">{ acfContact.title2 }</h1>
                                <div className="cw-bodycopy">
                                    { parser( acfContact.bodycopy2 )}
                                </div>
                                {<div className="pt-10 relative">
                                    <span className='text-purple-900 pr-2.5'><strong>FOLLOW US</strong></span>
                                    <Link href="https://www.twitter.com/Oliver_Burns" className="inline-block align-middle pr-1.5">
                                        <GrTwitter size={20} color="#581F5B" />
                                    </Link>
                                    <Link href="https://www.pinterest.com/oliverburnsuk/" className="inline-block align-middle pr-1.5">
                                        <FaPinterestP size={20} color="#581F5B" />
                                    </Link>
                                    <Link href="https://www.instagram.com/oliver_burns/" className="inline-block align-middle pr-1.5">
                                        <FaInstagram size={20} color="#581F5B" />
                                    </Link>
                                    <Link href="https://www.linkedin.com/company/1973074?trk=prof-exp-company-name" className="inline-block align-middle">
                                        <FaLinkedinIn size={20} color="#581F5B" />
                                    </Link>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="max-w-5xl m-auto py-10">
                    <div className="relative">
                        <Image src={ acfContact.mapImage.mediaItemUrl } alt={ acfContact.mapImage.altText }
                            width="980" height="751" />
                    </div>
                    <div className="relative py-10 px-5 text-center">
                        <h1 className="text-5xl md:text-7xl text-yellow-600 pb-5">{ acfContact.mapTitle }</h1>
                        <div className="cw-bodycopy">{ parser( acfContact.mapAddress ) }</div>
                    </div>
                </div>
            </section>
        </>
    )
}