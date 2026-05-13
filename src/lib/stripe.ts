import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build', {
    apiVersion: '2026-02-25.clover', // Best practice is to lock this to your current version
    appInfo: {
        name: 'Next.js E-Commerce Supabase',
        version: '0.1.0',
    },
})
