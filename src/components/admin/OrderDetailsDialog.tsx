'use client'

import { useState } from 'react'
import { X, MapPin, Package, CreditCard, User, ExternalLink } from 'lucide-react'

export default function OrderDetailsDialog({ order }: { order: any }) {
    const [isOpen, setIsOpen] = useState(false)

    if (!order) return null

    const shipping = order.shipping_details || {}

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-brand-700 rounded text-xs font-medium transition shadow-sm inline-flex items-center gap-1"
            >
                <ExternalLink className="w-3 h-3" />
                View
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                                <p className="text-sm text-gray-500 font-mono mt-1">ID: {order.id}</p>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            
                            {/* Top row: Customer & Payment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        Customer
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                                        <p className="text-sm font-medium text-gray-900">{shipping.name || 'Anonymous Guest'}</p>
                                        <p className="text-sm text-gray-600">{shipping.email || order.user_email || 'No email provided'}</p>
                                        <p className="text-sm text-gray-600">{shipping.phone || 'No phone provided'}</p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        Payment
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Method</span>
                                            <span className="text-sm font-semibold text-gray-900 uppercase">
                                                {order.stripe_session_id ? 'Stripe Card' : 'Cash on Delivery'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Gross Amount</span>
                                            <span className="text-lg font-bold text-brand-600">₹{(order.total_amount / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Date</span>
                                            <span className="text-sm text-gray-900">{new Date(order.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    Shipping Destination
                                </h3>
                                <div className="bg-sage-50/50 rounded-xl p-4 border border-sage-100">
                                    {shipping.address ? (
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {shipping.address}<br />
                                            {shipping.city}, {shipping.state} {shipping.zipCode}<br />
                                            India
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No exact shipping details captured.</p>
                                    )}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    Purchased Items
                                </h3>
                                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                                    {order.order_items?.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600 font-bold">
                                                    {item.quantity}x
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{item.products?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-gray-500">₹{(item.price_at_time / 100).toFixed(2)} each</p>
                                                </div>
                                            </div>
                                            <div className="text-right font-bold text-gray-900">
                                                ₹{((item.price_at_time * item.quantity) / 100).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                    {(!order.order_items || order.order_items.length === 0) && (
                                        <div className="p-4 text-center text-sm text-gray-500">No items found for this order.</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
