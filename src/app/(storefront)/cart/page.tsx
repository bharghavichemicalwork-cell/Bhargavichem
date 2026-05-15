'use client'

import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import QRCode from 'qrcode'
import { getGoogleDriveDirectLink } from '@/lib/utils'

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCartStore()
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [showShippingForm, setShowShippingForm] = useState(false)
    const [shippingDetails, setShippingDetails] = useState({ name: '', phone: '', address: '', city: '', postalCode: '' })
    const [showQrModal, setShowQrModal] = useState(false)
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
    const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)
    const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)
    const router = useRouter()

    const handleCheckout = async (paymentMethod: 'cod' | 'upi') => {
        try {
            setIsCheckingOut(true)
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, paymentMethod, shippingDetails }),
            })

            const data = await res.json()
            if (data.url && data.orderId && paymentMethod === 'upi') {
                // Generate UPI intent URL: upi://pay?pa=VPA&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
                const upiId = 'ssdchemicalslab984@oksbi'
                const businessName = 'Bharghavi Chemicals'
                const amount = (totalAmount() / 100).toFixed(2)
                const note = `Order ${data.orderId}`
                
                const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(businessName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`
                
                const dataUrl = await QRCode.toDataURL(upiUrl, {
                    errorCorrectionLevel: 'M',
                    margin: 2,
                    width: 260,
                    color: {
                        dark: '#0f172a',
                        light: '#ffffff',
                    },
                })
                setPendingOrderId(data.orderId)
                setPendingRedirectUrl(data.url) // This will be the success page
                setQrDataUrl(dataUrl)
                setShowQrModal(true)
            } else if (data.url) {
                window.location.href = data.url
            } else {
                alert(data.error || 'Something went wrong')
            }
        } catch (err) {
            console.error(err)
            alert('Checkout failed')
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center min-h-[60vh]">
                <ShoppingBag className="w-24 h-24 text-gray-200 mb-6" />
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Add products from our catalogue to proceed with your order.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-500 transition"
                >
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                                <Image
                                    src={getGoogleDriveDirectLink(item.image_url)}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        <Link href={`/products/${item.id}`} className="hover:text-brand-700 transition">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-lg font-bold text-gray-900 ml-4 whitespace-nowrap">
                                        ₹{(item.price / 100).toFixed(2)}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-brand-600 sm:text-sm sm:leading-6"
                                        >
                                            {[...Array(10)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-4">
                    <div className="glass-card border-0 p-8 sticky top-28 bg-white/80 backdrop-blur-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <dl className="space-y-5 text-sm text-sage-800/80">
                            <div className="flex justify-between">
                                <dt>Subtotal</dt>
                                <dd className="font-semibold text-gray-900">₹{(totalAmount() / 100).toFixed(2)}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt>Shipping</dt>
                                <dd className="font-semibold text-gray-900">Calculated at checkout</dd>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-5 mt-2">
                                <dt className="text-lg font-black text-gray-900">Total</dt>
                                <dd className="text-lg font-black text-brand-700">₹{(totalAmount() / 100).toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={() => setShowShippingForm(true)}
                                disabled={isCheckingOut || items.length === 0}
                                className="w-full bg-brand-600 text-white! hover:bg-brand-500 disabled:bg-sage-200 py-4 px-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 active:scale-[0.98] disabled:shadow-none disabled:hover:translate-y-0"
                            >
                                {isCheckingOut ? (
                                    <>Processing... <Loader2 className="w-5 h-5 ml-2 animate-spin" /></>
                                ) : (
                                    <>Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Modal Form */}
            {showShippingForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Shipping Details</h3>
                            <button onClick={() => setShowShippingForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCheckout('upi')
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={shippingDetails.name} onChange={e => setShippingDetails({ ...shippingDetails, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input required type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={shippingDetails.phone} onChange={e => setShippingDetails({ ...shippingDetails, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={shippingDetails.address} onChange={e => setShippingDetails({ ...shippingDetails, address: e.target.value })}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={shippingDetails.city} onChange={e => setShippingDetails({ ...shippingDetails, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input required type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-500 focus:border-brand-500" value={shippingDetails.postalCode} onChange={e => setShippingDetails({ ...shippingDetails, postalCode: e.target.value })} />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <button type="submit" disabled={isCheckingOut} className="w-full bg-brand-600 text-white! hover:bg-brand-500 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.23)] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-75 disabled:shadow-none disabled:hover:translate-y-0">
                                        {isCheckingOut ? 'Processing...' : 'Pay with UPI'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* QR Modal (shown before redirecting to payment) */}
            {showQrModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-sage-200">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-900">Scan to Pay</h3>
                                {pendingOrderId && (
                                    <p className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">Order Reference: {pendingOrderId}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setShowQrModal(false)}
                                className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none p-1"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="p-8">
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Scan this QR code with your phone to complete the payment securely on your mobile device.
                            </p>

                            <div className="mt-5 flex items-center justify-center">
                                {qrDataUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={qrDataUrl}
                                        alt="Order QR code"
                                        className="h-60 w-60 rounded-xl border border-sage-200 bg-white p-3"
                                    />
                                ) : (
                                    <div className="h-60 w-60 rounded-xl border border-sage-200 bg-sage-50 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => {
                                        if (pendingRedirectUrl) window.location.href = pendingRedirectUrl
                                    }}
                                    className="w-full bg-brand-600 text-white hover:bg-brand-500 py-3.5 px-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300"
                                >
                                    Continue to Payment <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!pendingOrderId) return
                                        await navigator.clipboard.writeText(pendingOrderId)
                                        alert('Order ID copied')
                                    }}
                                    className="w-full bg-white text-brand-800 border-2 border-brand-200 hover:border-brand-500 hover:bg-brand-50 py-3 px-4 rounded-xl font-bold transition-all duration-300"
                                >
                                    Copy Order ID
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
