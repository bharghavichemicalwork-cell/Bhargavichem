import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase Admin strictly for Backend Service Role tasks (Bypasses RLS for webhooks)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing stripe signature or secret' }, { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle specific event types
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any

        // Atomically update order status
        const { error } = await supabaseAdmin
            .from('orders')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('stripe_session_id', session.id)

        if (error) {
            console.error('Failed to update order status:', error)
            return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
        }
    }

    return NextResponse.json({ received: true }, { status: 200 })
}
