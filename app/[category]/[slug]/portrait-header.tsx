import Image from 'next/image'
import { SlArrowDown } from 'react-icons/sl'

export default function PortraitHeader({image, title, author}) {
    return (
        <>
        <div className="items-center max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2">
            <Image width="0" height="0" sizes="100vw" className="w-full h-auto"
                src={image?.mediaItemUrl} 
                alt={image?.altText} />
            <div className="px-0 pt-7 md:pt-0 md:pr-5 md:pl-14">
                <h1 className="text-[#BA995C] text-4xl md:text-6xl lg:text-8xl">{title}</h1>
                <div className="pt-2.5 pb-5 text-[#581F5B] text-xl md:text-2xl">
                    <i>By</i> {author ? author : "Oliver Burns"}
                </div>
                <SlArrowDown size={30} color="#BA995C" />
            </div>
        </div>
        </>
    )
}