'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const ProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().int().min(0, 'Price must be positive'), // Stored in paise for INR
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    weight: z.number().min(0, 'Weight must be non-negative'),
    image_url: z.string().url('Primary image URL is required'),
    image_urls: z.array(z.string().url('Must be a valid URL')).optional(),
})

async function getAdminSupabase() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        // We are using the Service Role Key here to bypass RLS for admin actions.
        // In a real app, you would check auth.uid() against an admins table FIRST.
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { },
            },
        }
    )
}

export async function createProduct(prevState: any, formData: FormData) {
    const validatedFields = ProductSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        price: Math.round(Number(formData.get('price')) * 100),
        stock: Number(formData.get('stock')),
        weight: Number(formData.get('weight') || 0),
        image_url: formData.get('image_url'),
        image_urls: formData.get('image_urls')
            ? String(formData.get('image_urls')).split('\n').map(s => s.trim()).filter(Boolean)
            : [],
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to create product. Invalid fields.',
        }
    }

    const supabase = await getAdminSupabase()

    const { error } = await supabase
        .from('products')
        .insert([validatedFields.data])

    if (error) {
        return { message: 'Database Error: Failed to Create Product.' }
    }

    revalidatePath('/(admin)/products', 'page')
    revalidatePath('/(storefront)', 'layout')

    return { success: true, message: 'Product successfully created!' }
}

export async function deleteProduct(id: string) {
    const supabase = await getAdminSupabase()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error('Failed to delete product')
    }

    revalidatePath('/(admin)/products', 'page')
    revalidatePath('/(storefront)', 'layout')
}

export async function getDashboardStats() {
    const supabase = await getAdminSupabase()

    try {
        // 1. Total Revenue (Sum of 'completed' orders)
        // Since Supabase doesn't easily support SUM in standard select without RPC, we query completed orders and reduce.
        const { data: revenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('status', 'completed')

        const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

        // 2. Active Orders (Count of 'pending' or 'processing')
        const { count: activeOrders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .in('status', ['pending', 'processing'])

        // 3. Products in Catalog
        const { count: totalProducts } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })

        // 4. Recent Orders (Last 5)
        const { data: recentOrders } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5)

        return {
            totalRevenue,
            activeOrders: activeOrders || 0,
            totalProducts: totalProducts || 0,
            recentOrders: recentOrders || []
        }
    } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        return null
    }
}
