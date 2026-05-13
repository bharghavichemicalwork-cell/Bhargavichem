'use client'

import { createProduct } from '@/actions/admin'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:bg-sage-200 disabled:text-sage-800/50 transition"
        >
            {pending ? 'Saving...' : 'Save Product'}
        </button>
    )
}

export default function NewProductForm() {
    const router = useRouter()
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <div className="mb-8">
                <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-700 transition">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Products
                </Link>
            </div>

            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
                <div className="px-4 py-6 sm:p-8">
                    <h2 className="text-xl font-bold leading-7 text-gray-900 mb-8">Add New Product</h2>

                    {/* We use action directly here. In Next 15 you can typically just pass the action function. */}
                    <form
                        ref={formRef}
                        action={async (formData) => {
                            const res = await createProduct(null, formData)
                            if (res?.error) {
                                alert(JSON.stringify(res.error, null, 2))
                            } else if (res?.message && !res.success) {
                                alert(res.message)
                            } else {
                                formRef.current?.reset()
                                router.push('/admin/products')
                                router.refresh()
                            }
                        }}
                        className="space-y-6"
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Product Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="e.g. Sodium Hypochlorite Solution, Industrial Grade Acid"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Include grade/specification, typical applications, packaging, and storage/handling notes..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-3">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                                    Price (INR)
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        step="0.01"
                                        min="0"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium leading-6 text-gray-900">
                                    Initial Stock
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="number"
                                        name="stock"
                                        id="stock"
                                        min="0"
                                        defaultValue={0}
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium leading-6 text-gray-900">
                                    Weight (grams)
                                </label>
                                <div className="mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-600 sm:text-sm sm:leading-6 rounded-md">
                                    <input
                                        type="number"
                                        name="weight"
                                        id="weight"
                                        min="0"
                                        defaultValue={0}
                                        required
                                        className="block w-full border-0 py-1.5 px-3 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="image_url" className="block text-sm font-medium leading-6 text-gray-900">
                                Primary Image URL
                            </label>
                            <div className="mt-2">
                                <input
                                    type="url"
                                    name="image_url"
                                    id="image_url"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Provide an absolute URL to the main product image. This is mandatory.</p>
                        </div>

                        <div>
                            <label htmlFor="image_urls" className="block text-sm font-medium leading-6 text-gray-900">
                                Additional Image URLs (Optional)
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="image_urls"
                                    name="image_urls"
                                    rows={3}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-600 sm:text-sm sm:leading-6 px-3"
                                    placeholder="Enter one URL per line..."
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Provide absolute URLs separated by a new line.</p>
                        </div>

                        <div className="pt-6 border-t border-gray-900/10">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
