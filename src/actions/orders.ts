'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

function getAdminClient() {
    return createSupabaseAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function getAdminOrders() {
    const supabaseAdmin = getAdminClient()

    // Query orders along with the user's email if possible, and their order items
    const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                quantity,
                price_at_time,
                products ( name )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching admin orders:', error)
        return []
    }

    return orders
}

export async function updateOrderStatus(orderId: string, status: string) {
    const supabaseAdmin = getAdminClient()

    const { error } = await supabaseAdmin
        .from('orders')
        .update({ status })
        .eq('id', orderId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/orders')
    return { success: true }
}

export async function getUserOrders(userId: string) {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                id,
                quantity,
                price_at_time,
                products ( name, image_url )
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching user orders:', error)
        return []
    }

    return orders
}
