'use client'

import { useCartStore } from '@/lib/store'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CartIcon() {
    const items = useCartStore((state) => state.items)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration errors by only rendering the count on the client
    useEffect(() => {
        setMounted(true)
    }, [])

    const itemCount = items.reduce((total, item) => total + item.quantity, 0)

    return (
        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-brand-700 transition flex items-center">
            <ShoppingCart className="h-6 w-6" />
            {mounted && itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-brand-600 rounded-full border-2 border-white">
                    {itemCount}
                </span>
            )}
        </Link>
    )
}
