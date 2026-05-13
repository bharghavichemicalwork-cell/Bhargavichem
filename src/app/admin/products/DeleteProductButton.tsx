'use client'

import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/actions/admin'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            startTransition(async () => {
                try {
                    await deleteProduct(id)
                    router.refresh()
                } catch (error) {
                    alert('Failed to delete product')
                }
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-600 hover:text-red-900 transition disabled:opacity-50"
            title="Delete Product"
        >
            <Trash2 className="w-5 h-5 inline-block" />
            <span className="sr-only">Delete</span>
        </button>
    )
}
