'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
    const clearCart = useCartStore((state) => state.clearCart)
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        // Clear the cart securely when landing on the success page, regardless of Stripe or COD
        clearCart()
    }, [clearCart])

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mb-8" />
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed successfully!</h1>
            <p className="text-lg text-gray-600 mb-8">
                Thank you for your order. We are now processing your items and will be in touch shortly.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:-translate-y-0.5 transition-all duration-300 flex items-center"
                >
                    Continue Shopping
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
            </div>
        </div>
    )
}
