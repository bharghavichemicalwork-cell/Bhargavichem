'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { Menu, X, LayoutDashboard, Package, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function AdminMobileNav() {
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
                className="p-2 -ml-2 text-gray-700 hover:text-brand-700 transition-colors md:hidden"
                aria-label="Open Admin Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Portal Drawer */}
            {mounted && createPortal(
                <div className="md:hidden">
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/50 z-100 transition-opacity backdrop-blur-sm ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Drawer */}
                    <div
                        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-85 bg-white z-110 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                            <span className="text-xl font-bold tracking-tight text-brand-700">Admin Panel</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand-700 transition">
                                <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                                Dashboard
                            </Link>
                            <Link href="/admin/products" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand-700 transition">
                                <Package className="w-5 h-5 mr-3 text-gray-400" />
                                Products
                            </Link>
                            <Link href="/admin/orders" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 hover:text-brand-700 transition">
                                <ShoppingBag className="w-5 h-5 mr-3 text-gray-400" />
                                Orders
                            </Link>
                        </nav>

                        <div className="p-4 border-t border-gray-200 shrink-0">
                            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition shadow-sm border border-gray-200">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Storefront
                            </Link>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
