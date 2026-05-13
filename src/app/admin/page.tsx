import { getDashboardStats } from '@/actions/admin'
import Link from 'next/link'
import { TrendingUp, Package, ShoppingBag, Clock, ChevronRight } from 'lucide-react'

export const revalidate = 0 // Always fetch fresh data for admin

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats()
    const { totalRevenue = 0, activeOrders = 0, totalProducts = 0, recentOrders = [] } = stats || {}

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Gross Revenue</p>
                            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">₹{(totalRevenue / 100).toFixed(2)}</h2>
                        </div>
                        <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Active Orders</p>
                            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">{activeOrders}</h2>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <Link href="/admin/orders" className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        View orders <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>

                {/* Products Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Total Products</p>
                            <h2 className="mt-2 text-4xl font-extrabold text-gray-900">{totalProducts}</h2>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <Link href="/admin/products" className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors">
                        Manage catalog <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>

            {/* Recent Activity Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                    </div>
                    <Link href="/admin/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">View All</Link>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No orders found yet.
                        </div>
                    ) : (
                        recentOrders.map(order => (
                            <Link key={order.id} href="/admin/orders" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors block">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-sm font-medium text-gray-900">Ord {order.id.slice(0, 8)}...</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Placed {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-bold text-gray-900">₹{(order.total_amount / 100).toFixed(2)}</span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
