import Link from 'next/link'
import { GrFacebookOption, GrTwitter } from 'react-icons/gr'
import { FaPinterestP, FaLinkedinIn } from 'react-icons/fa'
import { TfiEmail } from 'react-icons/tfi'

export default function ShareLinks({title, url, description, image}) {

    return (
        <>
            <span className="mr-1.5 text-[#BA995C] leading-10 align-middle">SHARE</span>
            <Link href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" className="inline-block align-middle mx-1.5">
                <GrFacebookOption size={20} color="#581F5B" />
            </Link>
            <Link href={`http://twitter.com/share?url=${url}&amp;text=${title}&amp;hashtags=OliverBurns`} target="_blank" className="inline-block align-middle mx-1.5">
                <GrTwitter size={20} color="#581F5B" />
            </Link>
            <Link href={`https://pinterest.com/pin/create/button/?url=${url}&amp;media=${image}&amp;description=${description}`} target="_blank" className="inline-block align-middle mx-1.5">
                <FaPinterestP size={20} color="#581F5B" />
            </Link>
            <Link href={`https://www.linkedin.com/shareArticle?mini=true&amp;url=${url}&amp;title=${title}&amp;summary=${description}`} target="_blank" className="inline-block align-middle mx-1.5">
                <FaLinkedinIn size={20} color="#581F5B" />
            </Link>
            <Link href={`mailto:?subject=OB World&amp;body=${url}`} className="inline-block align-middle mx-1.5">
                <TfiEmail size={20} color="#581F5B" />
            </Link>
        </>
    )
}