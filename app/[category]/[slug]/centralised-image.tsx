import Image from 'next/image'
import parser from 'html-react-parser'

export default function CentralisedImage({img}) {
    
    return (
        <>
        { img ? 
            <div className="relative pb-12 max-w-3xl mx-auto px-5 md:px-24">
                <Image width="1600" height="1200"
                    src={img?.mediaItemUrl} 
                    alt={img?.altText} />
                <div className="pt-2.5 text-[#bdbcbe] text-xs">{parser(img?.caption)}</div>
            </div>
            : null
        }
        </>
    )
}