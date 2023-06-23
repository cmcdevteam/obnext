import Image from 'next/image'
import { SlArrowDown } from 'react-icons/sl'

export default function LandscapeHeader({image, title, author}) {
    return (
        <>
        <div className="relative max-w-7xl mx-auto h-[600px]">
            <Image fill className="w-full object-cover" 
                src={image?.mediaItemUrl} 
                alt={image?.altText} />
            <div className="absolute top-1/2 -translate-y-1/2 w-full text-white">
                <h1 className="mx-auto text-center px-5 max-w-2xl text-5xl md:text-7xl">{title}</h1>
            </div>
            <div className="absolute w-full bottom-20">
                <div className="mx-auto max-w-2xl px-5 text-white text-center text-xl md:text-2xl"><i>By</i> {author ? author : "Oliver Burns"}</div>
                <SlArrowDown size={38} color="#BA995C" className="mx-auto" />
            </div>
        </div>
        </>
    )
}