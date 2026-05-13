'use client'

import { useState, useTransition } from 'react'
import { Plus, Check, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { addToDBCart } from '@/actions/cart'

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        price: number
        image_url: string
    }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        startTransition(async () => {
            // Create FormData properly
            const formData = new FormData()
            formData.append('productId', product.id)
            formData.append('quantity', '1')

            // Call Server Action
            const result = await addToDBCart({}, formData)

            if (result?.success) {
                // Also add to local Zustand store
                addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image_url: product.image_url,
                })

                setSuccess(true)
                setTimeout(() => setSuccess(false), 2000)
            } else {
                alert(result?.message || 'Failed to add to cart')
            }
        })
    }

    return (
        <button
            onClick={handleAddToCart}
            disabled={isPending || success}
            className={`w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300
        ${success
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-brand-100 text-brand-800 hover:bg-brand-200 active:scale-[0.98]'
                } disabled:opacity-75 disabled:cursor-not-allowed`}
        >
            {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : success ? (
                <Check className="w-5 h-5 mr-2" />
            ) : (
                <Plus className="w-5 h-5 mr-2" />
            )}
            {isPending ? 'Adding...' : success ? 'Added' : 'Add to Cart'}
        </button>
    )
}
