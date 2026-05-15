'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Home, ShoppingBag, Search } from 'lucide-react'

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-gray-700 hover:text-brand-600 transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            {/* Render Backdrop and Drawer into the body to escape backdrop-filter containing blocks */}
            {mounted && createPortal(
                <div className="lg:hidden">
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/50 z-100 transition-opacity backdrop-blur-sm ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Drawer */}
                    <div
                        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-85 bg-white z-110 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100 relative">
                            <span className="text-xl font-bold text-gray-900 tracking-tight z-10">Menu</span>

                            {/* Centered Logo in Drawer Header */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <Image src="/brand-logo.png" alt="BHARGHAVI CHEM MANUFACTURING Logo" width={80} height={80} className="object-contain h-10 w-auto pointer-events-auto" priority />
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 rounded-full"
                                aria-label="Close Menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 min-h-0 overflow-y-auto py-2 flex flex-col">
                            <div className="px-5 mb-4 mt-2 shrink-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-colors" />
                                </div>
                            </div>
                            <ul className="space-y-0.5 mt-2">
                                <li>
                                    <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-4 text-base font-medium text-gray-900 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                                        <Home className="w-5 h-5 mr-4 text-gray-400" />
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#products" onClick={() => setIsOpen(false)} className="flex items-center px-6 py-4 text-base font-medium text-gray-900 hover:bg-brand-50 hover:text-brand-700 transition-colors">
                                        <ShoppingBag className="w-5 h-5 mr-4 text-gray-400" />
                                        Products
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Footer area inside sidebar */}
                        <div className="shrink-0 p-6 bg-sage-50 border-t border-sage-100 mt-auto">
                            <p className="text-sm font-semibold text-gray-900 mb-1">Need help?</p>
                            <p className="text-xs text-sage-800/80 mb-4">Contact our team for product details and supply inquiries.</p>
                            <a href="mailto:support@bharghavichemicals.com" className="w-full block text-center bg-white border border-gray-200 py-3 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                support@bharghavichemicals.com
                            </a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
