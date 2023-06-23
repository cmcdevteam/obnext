'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RiArrowDownSFill } from 'react-icons/ri'
import { HiSearch } from 'react-icons/hi'

export default function BlogFilter({categories}) {
    const [activeCategory, setActiveCategory] = useState(null)

    return (
        <>
        <div className="pt-8 pb-10">
            <div className="text-center pr-4 md:hidden">
                <span className="inline-block text-[#581F5B]">CATEGORIES <RiArrowDownSFill size={25} className='inline-block align-top' /></span>
                <span className="absolute t-0 right-5 inline-block js-search"><HiSearch size={25} color="#BA995C"/></span>
            </div>
            
            <ul className="text-center hidden md:block">
                { 
                    categories.map(( category: any, index: number ) => (
                        <li key={category.slug} 
                            className={`inline-block tracking-wider mb-1.5 py-0.5 px-4${index === 0 ? '' : " border-l border-[#BA995C]"}`}>
                            <Link href={category.uri} legacyBehavior passHref>
                                <a className={`${activeCategory === category.slug ? "text-[#581F5B]" : "text-[#BA995C]"} pb-px uppercase`} 
                                    data-slug={category.slug}
                                    onClick={(event) => { setActiveCategory(category.slug) }}>
                                    {category.name}
                                </a>
                            </Link>
                        </li>
                    ))
                }
                <li key="search" className="inline-block px-4 li-search">
                    <HiSearch size={25} color="#BA995C"/>
                </li>
            </ul>
            { activeCategory === null ? '' : (
                <div className="pt-2.5 pl-5">
                    <Link legacyBehavior passHref href="/ob-world/">
                        <a className="text-[#BA995C] text-xs"
                            onClick={() => { setActiveCategory(null) }}>
                            &lt; BACK TO OB WORLD
                        </a>
                    </Link>
                </div>
            )}
        </div>
        </>
    )
}