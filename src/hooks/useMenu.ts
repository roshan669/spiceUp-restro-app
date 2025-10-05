import { useEffect, useMemo, useState } from 'react'
import type { MenuItem } from '../data/menu'

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

type RawItem = Record<string, unknown>

function getString(o: RawItem, ...keys: string[]): string | undefined {
    for (const k of keys) {
        const v = o[k]
        if (typeof v === 'string') return v
    }
    return undefined
}

function getNumber(o: RawItem, ...keys: string[]): number | undefined {
    for (const k of keys) {
        const v = o[k]
        if (typeof v === 'number') return v
        if (typeof v === 'string') {
            const n = Number(v)
            if (Number.isFinite(n)) return n
        }
    }
    return undefined
}

function normalize(raw: RawItem, index: number): MenuItem | null {
    if (!raw) return null
    const name: string = typeof raw.name === 'string' ? raw.name : String(getString(raw, 'title', 'item') ?? `Item ${index + 1}`)
    const priceNum = getNumber(raw, 'price', 'cost') ?? 0
    const price = Number.isFinite(priceNum) ? priceNum : 0
    const category: string = typeof raw.category === 'string' ? (raw.category as string) : (getString(raw, 'type') ?? 'OTHER')
    const description: string | undefined = typeof raw.description === 'string' ? (raw.description as string) : undefined
    const spicyRaw = getNumber(raw, 'spicy', 'spice', 'heat')
    const spicy: 0 | 1 | 2 | 3 | undefined =
        spicyRaw === undefined ? undefined : Math.max(0, Math.min(3, Number(spicyRaw))) as 0 | 1 | 2 | 3
    const veg: boolean | undefined = typeof raw.veg === 'boolean' ? (raw.veg as boolean) :
        (typeof category === 'string' && /veg/i.test(category) ? true : (typeof category === 'string' && /egg|chicken|mutton|fish/i.test(category) ? false : undefined))
    const image: string | undefined = getString(raw, 'image', 'img', 'photo') ||
        `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(name)},indian,food`
    const available: boolean | undefined = raw['available'] === false ? false : true
    const id = String(getString(raw, 'id') ?? `${slugify(name)}-${index}`)
    const autoDescription = generateDescription(name, category)
    const desc = description && description.trim().length > 0 ? description : autoDescription
    return { id, name, description: desc, price, spicy, veg, image, category: category as MenuItem['category'], available }
}

function generateDescription(name: string, category?: string): string {
    const n = name.toLowerCase()
    const cat = category?.toLowerCase() ?? ''
    if (n.includes('lolly') || n.includes('lollipop')) return 'Crispy fried chicken lollipops with tangy sauce.'
    if (n.includes('chicken leg')) return 'Juicy fried chicken leg with house spice.'
    if (n.includes('manchurian')) return 'Crispy bites in a tangy, spicy sauce.'
    if (n.includes('chilly') || n.includes('chilli')) return 'Spicy chilli-style stir fry with peppers.'
    if (n.includes('65')) return 'Crispy, spicy bite-sized fritters.'
    if (n.includes('noodle')) {
        if (/chicken/.test(cat)) return 'Stir-fried noodles with chicken and veggies.'
        if (/egg/.test(cat)) return 'Egg noodles stir-fried with veggies and sauce.'
        return 'Stir-fried veg noodles with soy and garlic.'
    }
    if (n.includes('rice')) {
        if (/chicken/.test(cat)) return 'Fragrant fried rice tossed with chicken.'
        if (/egg/.test(cat)) return 'Wok-tossed fried rice with eggs and scallions.'
        return 'Comforting veg fried rice with mixed veggies.'
    }
    if (n.includes('omelet') || n.includes('omelette')) return 'Fluffy omelet, lightly spiced.'
    if (n.includes('half fry')) return n.includes('double') ? 'Two sunny side up eggs, runny yolks.' : 'Single sunny side up egg, soft yolk.'
    return 'Tasty, freshly made street-style favorite.'
}

export function useMenu(url: string) {
    const [items, setItems] = useState<MenuItem[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let alive = true
        setLoading(true)
        setError(null)
        fetch(url)
            .then(async (r) => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then((json) => {
                if (!alive) return
                const array = Array.isArray(json) ? json : (Array.isArray(json?.items) ? json.items : [])
                const mapped = array.map(normalize).filter(Boolean) as MenuItem[]
                setItems(mapped)
            })
            .catch((e) => {
                if (!alive) return
                setError(String(e))
            })
            .finally(() => alive && setLoading(false))
        return () => { alive = false }
    }, [url])

    const categories = useMemo(() => {
        const set = new Set<string>()
        if (items) for (const m of items) set.add(m.category)
        return Array.from(set)
    }, [items])

    return { items: items ?? [], categories, loading, error }
}

export default useMenu
