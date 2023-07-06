import Image from 'next/image'
import Link from 'next/link'
import parser from 'html-react-parser'
import { SlArrowDown } from 'react-icons/sl'
import NewsletterForm from './newsletter-form'

export default async function HomePage() {
    const fetchedData = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getHomeData {
                            page(id: "/", idType: URI) {
                                acfHome {
                                    heroContents {
                                        imageVideo {
                                        ... on Page_Acfhome_heroContents_ImageVideo_Image {
                                            fieldGroupName
                                            file {
                                                altText
                                                mediaItemUrl
                                            }
                                        }
                                        ... on Page_Acfhome_heroContents_ImageVideo_Video {
                                            fieldGroupName
                                                file {
                                                    mediaItemUrl
                                                }
                                            }
                                        }
                                        mainTitle
                                        mainTitleColor
                                        popupVideoVimeo
                                        popupVideoYoutube
                                        linkType
                                        buttonTitle
                                    }
                                    createContents {
                                        ... on Page_Acfhome_CreateContents_AboutUs {
                                            fieldGroupName
                                            bodycopy
                                            title
                                            titleLink {
                                                target
                                                title
                                                url
                                            }
                                            image {
                                                altText
                                                mediaItemUrl
                                            }
                                        }
                                    }
                                }
                            }
                        }`
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const hero = fetchedData?.data?.page?.acfHome?.heroContents[0]
    const contents = fetchedData?.data?.page?.acfHome?.createContents

    function renderHeroButton() {
        switch(hero?.linkType) {
            case "none":
                return null

            case "vimeo":
                return <Link href={`https://vimeo.com/${hero?.popupVideoVimeo}`} target="_blank" className="py-2.5 px-5 border border-solid border-[#BA995C] text-sm text-[#BA995C]">{hero?.buttonTitle}</Link>
        }
    }

    return (
        <>
        <section>
            <div className="relative">
            {   hero?.imageVideo[0]?.fieldGroupName === "Page_Acfhome_heroContents_ImageVideo_Video" 
                    ? // content is an video }
                        <div className="relative w-screen h-screen h-full overflow-hidden">
                            <video loop muted autoplay="autoplay" playsinline poster={hero?.imageVideo[0]?.fieldGroupName} controls="false"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto min-w-full min-h-full object-cover">
                                <source src={ hero?.imageVideo[0]?.file?.mediaItemUrl } type="video/mp4"/>
                                Your browser does not support HTML5 video.
                            </video>
                            <div className=""></div>
                        </div>
                    : // otherwise content is image
                        <Image src={ hero?.imageVideo[0]?.file?.mediaItemUrl } alt={ hero?.file?.altText } fill 
                            style={{ objectFit: 'cover' }} className="relative w-screen h-screen" />
            }

                <div className="top-[10%] absolute left-0 w-full">
                    <div className="max-w-4xl text-center mx-auto px-5">
                        <div className="text-[194px] leading-[98px]" style={{color: (hero?.mainTitleColor)}}>
                            { parser(hero?.mainTitle) }
                        </div>
                        <Image src="/logo_nocaption.png" 
                            width="130" height="74" alt="Oliver Burns logo"
                            className="mt-12 mx-auto"/>
                        <div className="pt-8 pb-12">{renderHeroButton()}</div>
                        <SlArrowDown size={85} color="#BA995C" className="mx-auto" />
                    </div>
                </div>
            </div>
            <div className="h-2 bg-[#581F5B]"></div>
            
            <NewsletterForm />
        </section>
        </>
    )
}
