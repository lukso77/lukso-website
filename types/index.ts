export interface Product {
  id: number
  brand: string
  name: string
  volume: string
  price: number       // en miles COP (190 = $190.000)
  gender: 'mujer' | 'hombre' | 'unisex'
  image: string       // ruta local /fotos/...
  notes: string[]     // notas aromáticas
  occasions: Occasion[]
  description: string
  /** @deprecated usar image */
  imageQuery?: string
}

export type Occasion = 'noche' | 'trabajo' | 'cita' | 'casual'
