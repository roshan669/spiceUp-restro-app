export type Category = string

export type MenuItem = {
    id: string
    name: string
    description?: string
    price: number
    spicy?: 0 | 1 | 2 | 3
    veg?: boolean
    image?: string
    category: Category
    available?: boolean
}

export const menu: MenuItem[] = []
export const categories: Category[] = []