'use client'

import { useState, useTransition } from 'react'
import { ShoppingBag, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { addToDBCart } from '@/actions/cart'

interface BuyNowButtonProps {
    product: {
        id: string
        name: string
        price: number
        image_url: string
    }
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const addItem = useCartStore((state) => state.addItem)

    const handleBuyNow = () => {
        startTransition(async () => {
            const formData = new FormData()
            formData.append('productId', product.id)
            formData.append('quantity', '1')

            const result = await addToDBCart({}, formData)

            if (result?.success) {
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url,
                })

                router.push('/cart')
            } else {
                alert(result?.message || 'Failed to initialize buy now')
            }
        })
    }

    return (
        <button
            onClick={handleBuyNow}
            disabled={isPending}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 bg-brand-600 text-white hover:bg-brand-500 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none`}
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
                <ShoppingBag className="w-5 h-5 mr-2" />
            )}
            {isPending ? 'Processing...' : 'Buy Now'}
        </button>
    )
}
