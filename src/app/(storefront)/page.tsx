import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/products/ProductCard'

// Revalidate this page highly frequently or based on tags if you use standard fetch
export const revalidate = 60

export default async function StorefrontPage() {
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(12)

    if (error) {
        console.error('Failed to fetch products:', error.message)
        // graceful fail - will show 'No products found' below
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-sage-200 bg-white shadow-[0_20px_60px_rgba(2,6,23,0.10)] mb-24">
                {/* Background: clean gradient + subtle grid */}
                <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(94,234,212,0.14),transparent_55%),linear-gradient(to_bottom,rgba(248,250,252,1),rgba(241,245,249,1))]" />
                <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,rgba(15,23,42,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.25)_1px,transparent_1px)] bg-size-[36px_36px]" />

                {/* Content */}
                <div className="relative px-6 py-14 sm:px-10 sm:py-20 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                        {/* Left: copy */}
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur">
                                <span className="inline-block h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(6,182,212,0.15)]" />
                                Cleaning chemicals • Industrial supply
                            </div>

                            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                                BHARGHAVI CHEM MANUFACTURING
                                <span className="block text-transparent bg-clip-text bg-linear-to-r from-brand-700 via-brand-500 to-gold-500">
                                    Manufacturing that stays consistent.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg sm:text-xl text-slate-700 leading-relaxed">
                                From daily-use cleaning formulations to industrial-grade solutions, we focus on predictable specs,
                                safe handling guidance, and dependable dispatch timelines.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-4">
                                <a
                                    href="#products"
                                    className="rounded-2xl bg-brand-600 px-7 py-3.5 text-base font-bold text-white shadow-[0_12px_30px_rgba(8,145,178,0.30)] hover:bg-brand-500 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    View Products
                                </a>
                                <a
                                    href="#products"
                                    className="rounded-2xl bg-white/70 px-7 py-3.5 text-base font-bold text-slate-900 ring-1 ring-inset ring-sage-200 hover:bg-white hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Request a Quote
                                </a>
                            </div>
                        </div>

                        {/* Right: feature tiles */}
                        <div className="lg:col-span-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                <div className="rounded-2xl bg-white/70 backdrop-blur border border-sage-200 p-5 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-900">Quality & consistency</p>
                                    <p className="mt-1 text-sm text-slate-700">Batch-to-batch specs you can rely on.</p>
                                </div>
                                <div className="rounded-2xl bg-white/70 backdrop-blur border border-sage-200 p-5 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-900">Packaging options</p>
                                    <p className="mt-1 text-sm text-slate-700">Retail packs to bulk drums available.</p>
                                </div>
                                <div className="rounded-2xl bg-white/70 backdrop-blur border border-sage-200 p-5 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-900">Compliance-ready</p>
                                    <p className="mt-1 text-sm text-slate-700">Clear handling and storage guidance.</p>
                                </div>
                                <div className="rounded-2xl bg-white/70 backdrop-blur border border-sage-200 p-5 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-900">Fast dispatch</p>
                                    <p className="mt-1 text-sm text-slate-700">Efficient fulfillment for repeat orders.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section Header */}
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-sage-800 sm:text-4xl mb-4">Our Product Range</h2>
                <div className="w-24 h-1.5 bg-brand-500 mx-auto rounded-full mb-4"></div>
                <p className="text-lg text-sage-800/80">Industrial chemicals manufactured with quality control and reliable specifications.</p>
            </div>

            <div id="products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 scroll-mt-24">
                {products?.map((product, i) => (
                    <ProductCard key={product.id} product={product} priority={i < 4} />
                ))}
                {(!products || products.length === 0) && (
                    <p className="col-span-full text-center text-gray-500 py-12">
                        No products found. Please check back later.
                    </p>
                )}
            </div>
        </div>
    )
}
