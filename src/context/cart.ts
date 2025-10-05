import { createContext, useContext } from 'react'
import type { CartContextValue } from './CartProvider'

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
