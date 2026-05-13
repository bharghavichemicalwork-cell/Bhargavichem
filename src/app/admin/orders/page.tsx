import { getAdminOrders, updateOrderStatus } from '@/actions/orders'
import { revalidatePath } from 'next/cache'
import OrderDetailsDialog from '@/components/admin/OrderDetailsDialog'

export default async function AdminOrdersPage() {
    const orders = await getAdminOrders()

    async function handleStatusChange(formData: FormData) {
        'use server'
        const orderId = formData.get('orderId') as string
        const status = formData.get('status') as string
        await updateOrderStatus(orderId, status)
        revalidatePath('/admin/orders')
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-900">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-mono text-gray-500">{order.id}</div>
                                        <div className="mt-1 text-xs text-gray-400">TXN: {order.stripe_session_id?.slice(0, 15)}...</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        ₹{(order.total_amount / 100).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <OrderDetailsDialog order={order} />
                                            <form action={handleStatusChange} className="flex items-center gap-2 border-l border-gray-200 pl-3">
                                                <input type="hidden" name="orderId" value={order.id} />
                                                <select
                                                    name="status"
                                                    defaultValue={order.status}
                                                    className="text-sm rounded border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button
                                                    type="submit"
                                                    className="px-3 py-1 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded text-xs font-medium transition"
                                                >
                                                    Update
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
