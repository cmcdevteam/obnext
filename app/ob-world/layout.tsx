import Image from 'next/image'
import BlogFilter from './blog-filter'

export const metadata = {
    title: 'OB World',
    description: 'Ob World description Thoughtfully designing and building the world\'s finest homes.',
}

export default async function OBWorldLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const res = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getContentData {
                            page(id: "ob-world", idType: URI) {
                                title
                                acfOBWorld {
                                    heroImage {
                                        altText
                                        mediaItemUrl
                                    }
                                    categoryNav {
                                        slug
                                        uri
                                        name
                                    }
                                }
                            }
                        }`
            }),
            next: { revalidate: 10 },
        }).then((res) => res.json())

    const acfOBWorld = res?.data?.page?.acfOBWorld

    return (
        <>
        <section>
            <div className="w-full h-96 relative">
                <Image
                    priority
                    fill
                    src={ acfOBWorld.heroImage.mediaItemUrl }
                    alt={ acfOBWorld.heroImage.altText }
                    className='object-cover'
                />
                
                <div className="absolute top-1/2 -translate-y-2/4 w-full">
                    <h1 className="text-7xl md:text-8xl uppercase text-white text-center max-w-2xl mx-auto">{ res.data.page.title }</h1>
                </div>
            </div>
        </section>

        <section>
            <BlogFilter categories={acfOBWorld.categoryNav} />
            {children} 
        </section>
        </>
    )
}