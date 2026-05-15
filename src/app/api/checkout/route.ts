import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { items, paymentMethod = 'upi', shippingDetails } = await req.json()
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        if (!shippingDetails) {
            return NextResponse.json({ error: 'Shipping details are required' }, { status: 400 })
        }

        // Attempt to get the logged-in user (optional for guest checkout)
        const supabase = await createClient()
        let { data: { user } } = await supabase.auth.getUser()

        const supabaseAdmin = await createClient({ admin: true })

        // If no user is found, silently create a background guest user to satisfy the database Foreign Key
        if (!user) {
            const dummyEmail = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}@guest.bharghavichemicals.system`

            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
                email: dummyEmail,
                password: 'GuestPassword123!',
                email_confirm: true
            })

            if (createError || !newUser.user) {
                console.error('Failed to create guest user', createError)
                return NextResponse.json({ error: 'Failed to initialize guest checkout' }, { status: 500 })
            }

            user = newUser.user
        }

        let totalAmount = 0;
        items.forEach((item: any) => {
            totalAmount += item.price * item.quantity;
        });

        // Create the pending order in Supabase using Admin client to bypass RLS for guests
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: user.id,
                stripe_session_id: `upi_${Date.now()}`,
                total_amount: totalAmount,
                status: 'pending',
                shipping_details: shippingDetails
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json({ error: `Failed to create pending order: ${orderError.message}` }, { status: 500 })
        }

        // Insert order items
        const orderItemsToInsert = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_time: item.price,
        }))

        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(orderItemsToInsert)

        if (itemsError) {
            console.error('Order items error:', itemsError)
            return NextResponse.json({ error: 'Failed to insert order items' }, { status: 500 })
        }

        // Return the success URL for both UPI and COD
        return NextResponse.json({ 
            url: `${origin}/cart/success?order_id=${order.id}`, 
            orderId: order.id 
        })
        
    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
