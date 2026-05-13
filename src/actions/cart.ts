'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. Zod schema for strict validation
const AddToCartSchema = z.object({
    productId: z.string().uuid("Invalid Product ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(99, "Max 99 items"),
})

export async function addToDBCart(prevState: any, formData: FormData) {
    // Validate data
    const validatedFields = AddToCartSchema.safeParse({
        productId: formData.get('productId'),
        quantity: Number(formData.get('quantity')),
    })

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Failed to add item to cart. Invalid request.',
        }
    }

    const { productId, quantity } = validatedFields.data

    // Initialize Supabase Server client
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // Ignored in server action
                    }
                },
            },
        }
    )

    try {
        const { data: { user } } = await supabase.auth.getUser()

        // Verify product exists & check stock.
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single()

        if (productError || !product) {
            return { message: 'Product not found.', success: false }
        }

        if (product.stock < quantity) {
            return { message: `Only ${product.stock} items left in stock.`, success: false }
        }

        if (user) {
            // In a real application, you'd insert into a server-side carts table here.
            // E.g.: await supabase.from('cart_items').upsert({ user_id: user.id, product_id: ... })

            // Trigger Incremental Static Regeneration (ISR) to ensure UI correctly reflects stock changes
            revalidatePath('/(storefront)', 'layout')
        }

        return { message: 'Successfully added to cart!', success: true }

    } catch (err) {
        console.error('Server action failed:', err)
        return { message: 'Internal Server Error', success: false }
    }
}
