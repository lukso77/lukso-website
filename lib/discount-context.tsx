'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Product } from '@/types'

export interface Discount {
  id: number
  label: string
  type: 'tienda' | 'marca' | 'producto'
  pct: number          // percentage, e.g. 20 = 20% off
  brand?: string       // when type = 'marca'
  productId?: number   // when type = 'producto'
  active: boolean
  createdAt: string
}

interface DiscountResult {
  pct: number
  final: number   // price after discount (in thousands COP)
}

interface DiscountCtx {
  discounts: Discount[]
  loading: boolean
  getDiscount: (product: Product) => DiscountResult | null
  reload: () => void
}

const Ctx = createContext<DiscountCtx>({
  discounts: [], loading: false,
  getDiscount: () => null, reload: () => {},
})

export function DiscountProvider({ children }: { children: ReactNode }) {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch('/api/discounts')
      .then(r => r.json())
      .then(setDiscounts)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const getDiscount = (product: Product): DiscountResult | null => {
    const active = discounts.filter(d => d.active)
    let best = 0

    for (const d of active) {
      if (d.type === 'tienda') best = Math.max(best, d.pct)
      if (d.type === 'marca' && d.brand?.toLowerCase() === product.brand?.toLowerCase()) best = Math.max(best, d.pct)
      if (d.type === 'producto' && d.productId === product.id) best = Math.max(best, d.pct)
    }

    if (best === 0) return null
    const final = Math.round(product.price * (1 - best / 100))
    return { pct: best, final }
  }

  return (
    <Ctx.Provider value={{ discounts, loading, getDiscount, reload: load }}>
      {children}
    </Ctx.Provider>
  )
}

export const useDiscounts = () => useContext(Ctx)
