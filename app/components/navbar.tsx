'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react';

export default function NavBar({mid, leftmenu, rightmenu}) {
    const [showMenu, setShowMenu] = useState(false)
    const [activeMenu, setActiveMenu] = useState(null)
    const activeMenuRef = useRef(activeMenu)

    const setURI = (uri: string) => {
        activeMenuRef.current = uri
        setActiveMenu(uri)
    }

    function onNavClick(event) {
        const activeLink = event.target.getAttribute("href")

        if( activeMenuRef.current != activeLink ) {
            setURI(activeLink)
        }

        if( showMenu ) {
            setShowMenu(false)
        }
    }

    return (
        <>
        <header className="bg-[#fdfbff] fixed py-4 top-0 bottom-auto inset-x-0 z-50 overflow-hidden transition-all border-b-4 border-solid border-x-0 border-t-0 border-4 border-[#581F5B] md:border-none">
            <Link legacyBehavior passHref href="/">
                <a onClick={onNavClick} className="logo-link w-24 h-20 no-underline mx-auto block mt-5 mb-0 inset-0 relative md:w-28 lg:-mt-9 lg:-ml-12 lg:absolute lg:top-1/2 lg:left-1/2 lg:z-10">
                    <Image src="/logo.png" priority alt="Oliver Burns logo" width="107" height="72" />
                </a>
            </Link>
            <button className="block absolute z-20 left-6 top-9 py-2.5 px-0 cursor-pointer select-none transition-all duration-300 md:hidden" 
                onClick={() => {setShowMenu(! showMenu)}} >
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                </svg>
            </button>

            <nav className={`${! showMenu ? "hidden" : ""} max-h-full relative text-center md:block`}>
                <div className="text-center p-0 text-center float-none h-[38%] m-0 inline-block md:text-right lg:w-1/2 lg:float-left lg:block lg:pr-24 lg:pl-0">
                { leftmenu.map(( menuItem: any, index: number ) => (    
                    <div key={index} className="opacity-100 table w-full translate-y-0 h-1/3 transition-all align-middle text-base py-2.5 md:w-auto md:inline-block md:py-6">
                        <Link legacyBehavior passHref href={menuItem.node.path}>
                            <a onClick={onNavClick} 
                                className={`${activeMenu+"/" === menuItem.node.path ? "text-[#581F5B]" : "text-[#BA995C] hover:text-[#581F5B] hover:transition-colors"} uppercase font-bold tracking-wide md:mx-3`} 
                                title={menuItem.node.label}>
                                {menuItem.node.label}
                            </a>
                        </Link>
                    </div>
                ))}
                </div>

                <div className="text-center p-0 text-center float-none h-[38%] m-0 inline-block md:text-left lg:w-1/2 lg:float-left lg:pl-24 lg:pr-0">
                { rightmenu.map(( menuItem: any, index: number ) => (    
                    <div key={mid+index} className="opacity-100 table w-full translate-y-0 h-1/3 transition-all align-middle text-base py-2.5 md:w-auto md:inline-block md:py-6">
                        <Link legacyBehavior passHref href={menuItem.node.path}>
                            <a onClick={onNavClick}
                                className={`${activeMenu+"/" === menuItem.node.path ? "text-[#581F5B]" : "text-[#BA995C] hover:text-[#581F5B] hover:transition-colors"} uppercase font-bold tracking-wide md:mx-3`} 
                                title={menuItem.node.label}>
                                {menuItem.node.label}
                            </a>
                        </Link>
                    </div>
                ))}
                </div>
            </nav>
        </header>
        </>
    )
}