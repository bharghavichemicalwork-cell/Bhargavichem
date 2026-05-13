import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image_url: string
}

interface CartStore {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalAmount: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items
                const existingItem = currentItems.find((i) => i.id === item.id)

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    })
                } else {
                    set({ items: [...currentItems, item] })
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) })
            },
            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                })
            },
            clearCart: () => set({ items: [] }),
            totalAmount: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },
        }),
        {
            name: 'ecommerce-cart-storage', // unique name for localStorage key
            storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
        }
    )
)
