'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

/* ── Types ──────────────────────────────────────────────────────────── */
export interface CartItem {
  product: Product
  qty: number
}

interface CartState {
  items: CartItem[]
  open: boolean
}

type CartAction =
  | { type: 'ADD';    product: Product }
  | { type: 'REMOVE'; id: number }
  | { type: 'INC';    id: number }
  | { type: 'DEC';    id: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] }

/* ── Reducer ────────────────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.product.id === action.product.id)
      const items = exists
        ? state.items.map(i =>
            i.product.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...state.items, { product: action.product, qty: 1 }]
      return { ...state, items, open: true }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.product.id !== action.id) }
    case 'INC':
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      }
    case 'DEC':
      return {
        ...state,
        items: state.items
          .map(i => i.product.id === action.id ? { ...i, qty: i.qty - 1 } : i)
          .filter(i => i.qty > 0),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
    case 'HYDRATE':
      return { ...state, items: action.items }
    default:
      return state
  }
}

/* ── Context ────────────────────────────────────────────────────────── */
interface CartContextValue {
  items: CartItem[]
  open: boolean
  totalItems: number
  totalPrice: number
  add:    (product: Product) => void
  remove: (id: number) => void
  inc:    (id: number) => void
  dec:    (id: number) => void
  clear:  () => void
  openCart:  () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })

  // Persistir en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lukso_cart')
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('lukso_cart', JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0)
  const totalPrice = state.items.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider value={{
      items:      state.items,
      open:       state.open,
      totalItems,
      totalPrice,
      add:       p  => dispatch({ type: 'ADD',    product: p }),
      remove:    id => dispatch({ type: 'REMOVE', id }),
      inc:       id => dispatch({ type: 'INC',    id }),
      dec:       id => dispatch({ type: 'DEC',    id }),
      clear:     ()  => dispatch({ type: 'CLEAR' }),
      openCart:  ()  => dispatch({ type: 'OPEN' }),
      closeCart: ()  => dispatch({ type: 'CLOSE' }),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
