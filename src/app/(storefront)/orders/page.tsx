import { getUserOrders } from '@/actions/orders'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getGoogleDriveDirectLink } from '@/lib/utils'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const orders = await getUserOrders(user.id)

    return (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                    You haven't placed any orders yet.
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200 p-6 sm:flex sm:items-center sm:justify-between">
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8 flex-1">
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date placed</div>
                                        <div className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total amount</div>
                                        <div className="text-sm text-gray-900 font-medium">₹{(order.total_amount / 100).toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Order status</div>
                                        <div className={`text-sm font-medium ${order.status === 'completed' ? 'text-green-600' :
                                                order.status === 'processing' ? 'text-blue-600' :
                                                    order.status === 'cancelled' ? 'text-red-600' :
                                                        'text-yellow-600'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </div>
                                    </div>
                                    <div className="sm:text-right hidden sm:block">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Order #</div>
                                        <div className="text-sm font-mono text-gray-500 truncate">{order.id.slice(0, 8)}...</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <ul className="divide-y divide-gray-200">
                                    {order.order_items?.map((item: any) => (
                                        <li key={item.id} className="py-4 flex gap-4">
                                            {item.products?.image_url && (
                                                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                                                    <Image src={getGoogleDriveDirectLink(item.products.image_url)} alt={item.products.name || 'Product'} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">{item.products?.name || 'Unknown Product'}</h4>
                                                <p className="mt-1 text-sm text-gray-500 flex gap-4">
                                                    <span>Qty: {item.quantity}</span>
                                                    <span>₹{(item.price_at_time / 100).toFixed(2)}</span>
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
