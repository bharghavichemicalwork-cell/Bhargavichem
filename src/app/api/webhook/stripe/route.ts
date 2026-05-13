import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// We need an admin client to bypass RLS when updating orders globally
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')

        if (!signature || !webhookSecret) {
            console.error('Missing Stripe Webhook Secret or Signature')
            return NextResponse.json({ error: 'Missing Stripe Webhook Secret or Signature' }, { status: 400 })
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`)
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as any;

                // Retrieve the session from Stripe to get expanded line items if needed,
                // but we already have the stripe_session_id in our database.
                const stripe_session_id = session.id;

                // Update the order status to completed
                const { error: updateError } = await supabaseAdmin
                    .from('orders')
                    .update({ status: 'completed' })
                    .eq('stripe_session_id', stripe_session_id)

                if (updateError) {
                    console.error('Error fulfilling order in Supabase:', updateError)
                    return NextResponse.json({ error: 'Order fulfillment failed' }, { status: 500 })
                }

                console.log(`Order for session ${stripe_session_id} was successfully fulfilled.`);
                break;
            default:
                console.log(`Unhandled stripe event type ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Stripe webhook error:', error)
        return NextResponse.json({ error: 'Stripe webhook handler failed' }, { status: 500 })
    }
}
