import { useEffect, useMemo, useState } from 'react'
import type { MenuItem } from '../data/menu'

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

type RawItem = Record<string, unknown>

function normalize(raw: RawItem, index: number): MenuItem | null {
    if (!raw) return null
    const name: string = typeof raw.name === 'string' ? raw.name : String((raw as any).title ?? (raw as any).item ?? `Item ${index + 1}`)
    const priceNum = Number((raw as any).price ?? (raw as any).cost ?? 0)
    const price = Number.isFinite(priceNum) ? priceNum : 0
    const category: string = typeof raw.category === 'string' ? (raw.category as string) : (((raw as any).type as string) ?? 'OTHER')
    const description: string | undefined = typeof raw.description === 'string' ? (raw.description as string) : undefined
    const spicyRaw = (raw as any).spicy ?? (raw as any).spice ?? (raw as any).heat
    const spicy: 0 | 1 | 2 | 3 | undefined =
        spicyRaw === undefined ? undefined : Math.max(0, Math.min(3, Number(spicyRaw))) as 0 | 1 | 2 | 3
    const veg: boolean | undefined = typeof raw.veg === 'boolean' ? (raw.veg as boolean) :
        (typeof category === 'string' && /veg/i.test(category) ? true : (typeof category === 'string' && /egg|chicken|mutton|fish/i.test(category) ? false : undefined))
    const image: string | undefined = (raw as any).image || (raw as any).img || (raw as any).photo ||
        `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(name)},indian,food`
    const available: boolean | undefined = (raw as any).available === false ? false : true
    const id = String((raw as any).id ?? `${slugify(name)}-${index}`)
    return { id, name, description, price, spicy, veg, image, category: category as MenuItem['category'], available }
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
