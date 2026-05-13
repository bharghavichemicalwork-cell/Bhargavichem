import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import AddToCartButton from '@/components/products/AddToCartButton'
import BuyNowButton from '@/components/products/BuyNowButton'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getGoogleDriveDirectLink } from '@/lib/utils'

export const revalidate = 60 // ISR: Revalidate every 60 seconds

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const resolvedParams = await params

    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-700 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to catalogue
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image */}
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                            src={getGoogleDriveDirectLink(product.image_url)}
                            alt={product.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center"
                            priority
                        />
                    </div>
                    {product.image_urls && product.image_urls.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                            {product.image_urls.map((url: string, index: number) => (
                                <div key={index} className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                    <Image
                                        src={getGoogleDriveDirectLink(url)}
                                        alt={`${product.name} ${index + 1}`}
                                        fill
                                        sizes="(max-width: 1024px) 25vw, 12vw"
                                        className="object-cover object-center"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col pt-4 lg:pt-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                        {product.name}
                    </h1>
                    <div className="text-3xl font-semibold text-gray-900 mb-8">
                        ₹{(product.price / 100).toFixed(2)}
                    </div>

                    <div className="prose prose-lg text-gray-500 mb-10">
                        <p>{product.description}</p>
                    </div>

                    <div className="mt-auto p-6 bg-gray-50 rounded-2xl border border-gray-200">
                        {product.weight > 0 && (
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-600 font-medium">Weight</span>
                                <span className="text-gray-900 font-medium">{product.weight} g</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-600 font-medium">Availability</span>
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    In Stock ({product.stock})
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {product.stock > 0 ? (
                            <div className="flex flex-col gap-3">
                                <BuyNowButton product={product} />
                                <AddToCartButton product={product} />
                            </div>
                        ) : (
                            <button disabled className="w-full flex items-center justify-center py-4 px-4 rounded-md text-base font-semibold bg-gray-300 text-gray-500 cursor-not-allowed">
                                Currently Unavailable
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
