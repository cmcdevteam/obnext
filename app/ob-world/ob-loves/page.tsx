import LovesGrid from "./loves-grid"

export default async function LovesLandingPage() {
    const fetchedData = await fetch( process.env.GRAPHQL_API_URL, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `query getPinterestPosts {
                            loves(first: 14) {
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
                        }`
            }),
            next: { revalidate: 1 },
        })
        .then((res) => res.json())

    const loves = fetchedData?.data?.loves?.edges

    return (
        <>
        <section>
            <LovesGrid loves={loves} />
        </section>
        </>
    )
}