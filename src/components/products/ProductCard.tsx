import Image from 'next/image'
import Link from 'next/link'
import AddToCartButton from './AddToCartButton'
import BuyNowButton from './BuyNowButton'
import { getGoogleDriveDirectLink } from '@/lib/utils'

interface ProductCardProps {
    product: {
        id: string
        name: string
        price: number
        image_url: string
        description: string
    }
    priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
    return (
        <div className="group glass-card overflow-hidden flex flex-col h-full border-0 relative">
            <Link href={`/products/${product.id}`} className="relative h-72 w-full bg-sage-100/50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointers-event-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <Image
                    src={getGoogleDriveDirectLink(product.image_url)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    priority={priority}
                />
            </Link>

            <div className="p-6 flex flex-col flex-1 z-20 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                    <Link href={`/products/${product.id}`} className="hover:text-brand-600 transition-colors">
                        {product.name}
                    </Link>
                </h3>
                <p className="text-sm text-sage-800/80 line-clamp-2 mb-6 flex-1 font-light">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-6 mt-auto">
                    <span className="text-2xl font-black text-brand-700 tracking-tight">
                        ₹{(product.price / 100).toFixed(2)}
                    </span>
                </div>

                <div className="flex gap-2">
                    <AddToCartButton product={product} />
                    <BuyNowButton product={product} />
                </div>
            </div>
        </div>
    )
}
