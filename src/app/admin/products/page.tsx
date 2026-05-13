import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import Image from 'next/image'
import DeleteProductButton from './DeleteProductButton'
import { getGoogleDriveDirectLink } from '@/lib/utils'

export const revalidate = 0 // Always fetch fresh data for admin

export default async function AdminProductsPage() {
    const supabase = await createClient()

    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Supabase fetch error:', error.message)
        // We let products be null, which will trigger the "No products found." row in the table below.
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="sm:flex sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
                    <p className="mt-2 text-sm text-gray-700">A list of all the products currently available in your store.</p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/products/new"
                        className="flex items-center justify-center rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500"
                    >
                        <Plus className="w-5 h-5 mr-1" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm ring-1 ring-gray-200 sm:rounded-xl">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sm:pl-6">Product Details</th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-3 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Inventory Status</th>
                                        <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 italic-none">
                                    {products?.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="whitespace-nowrap py-5 pl-4 pr-3 sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-12 w-12 shrink-0 relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                                                        {product.image_url ? (
                                                            <Image className="object-cover" src={getGoogleDriveDirectLink(product.image_url)} alt="" fill sizes="48px" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-bold text-gray-900 truncate max-w-60">{product.name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5 font-mono">ID: {product.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm font-bold text-gray-900">
                                                ₹{(product.price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-5 text-sm">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center w-fit rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                                                        product.stock > 10 
                                                            ? 'bg-green-50 text-green-700 border-green-100' 
                                                            : product.stock > 0 
                                                                ? 'bg-yellow-50 text-yellow-700 border-yellow-100' 
                                                                : 'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 ml-0.5">{product.stock} units available</span>
                                                </div>
                                            </td>
                                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Link 
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="p-2 text-gray-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <DeleteProductButton id={product.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!products || products.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="py-20 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                        <Package className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-900 font-bold">No products found</p>
                                                    <p className="text-gray-500 text-sm mt-1 max-w-xs">Start building your catalog by adding your first product using the button above.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
