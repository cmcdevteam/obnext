import Image from 'next/image'
import Link from 'next/link'

export default function LovesGrid({loves}) {            
    
    return (
        <>  
        <div className="max-w-[1240px] px-5 mx-auto space-y-3 gap-3 columns-2 md:columns-3 lg:columns-4">
        {
            loves.map((love) => (
                <Link href={love.node.uri} key={love.node.uri}>
                    <Image width="0" height="0" sizes="100vw"
                        src={love?.node?.featuredImage?.featuredImage?.mediaItemUrl} 
                        alt={love?.node?.featuredImage?.featuredImage?.altText} 
                        className="pb-3 w-full h-auto" />
                </Link>
            ))
        }
        </div>
        </>
    )
}