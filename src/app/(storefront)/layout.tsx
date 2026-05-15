import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import CartIcon from '@/components/cart/CartIcon'
import MobileNav from '@/components/layout/MobileNav'
import WhatsAppButton from '@/components/layout/WhatsAppButton'

export default function StorefrontLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-sage-50">
            <header className="glass sticky top-0 z-50 border-b border-gray-100/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 sm:h-24 items-center justify-between relative">
                        {/* Mobile Menu - Left */}
                        <div className="flex items-center z-50 lg:hidden w-1/3">
                            <MobileNav />
                        </div>

                        {/* Desktop links - Left */}
                        <div className="hidden lg:flex items-center gap-8 w-1/3">
                            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-brand-600 transition-colors">Home</Link>
                            <Link href="/#products" className="text-sm font-bold text-gray-700 hover:text-brand-600 transition-colors">Shop</Link>
                        </div>

                        {/* Logo - Center Absolute on Mobile, Center Flex on Desktop */}
                        <div className="absolute inset-x-0 mx-auto w-fit flex justify-center pointer-events-none z-0 lg:static lg:mx-0 lg:w-1/3 lg:justify-center">
                            <Link href="/" className="flex items-center pointer-events-auto">
                                <Image src="/brand-logo.png" alt="BHARGHAVI CHEM MANUFACTURING Logo" width={160} height={160} className="object-contain h-20 sm:h-24 w-auto scale-110 sm:scale-125 origin-center transition-transform hover:scale-125 hover:sm:scale-[1.35]" priority />
                            </Link>
                        </div>

                        {/* Cart - Right */}
                        <div className="flex items-center justify-end gap-4 z-10 w-1/3">
                            <CartIcon />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-sage-100/50 border-t border-gray-200/60 py-12 mt-auto">
                <div className="mx-auto max-w-7xl px-4 text-center text-sage-800">
                    <p className="font-medium">&copy; {new Date().getFullYear()} BHARGHAVI CHEM MANUFACTURING. All rights reserved.</p>
                    <p className="text-sm mt-2 opacity-70">Manufacturing and supply of quality industrial chemicals.</p>
                </div>
            </footer>

            {/* Floating Elements */}
            <WhatsAppButton />
        </div >
    )
}
