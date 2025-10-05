import "./App.css";
import { useMemo, useState } from "react";
import CartProvider from "./context/CartProvider.tsx";
import { useCart } from "./context/cart.ts";
import { menu as fallbackMenu } from "./data/menu.ts";
import useMenu from "./hooks/useMenu.ts";
import Header from "./components/Header.tsx";
import SearchBar from "./components/SearchBar.tsx";
import CategoryFilter from "./components/CategoryFilter.tsx";
import MenuGrid from "./components/MenuGrid.tsx";
import CartDrawer from "./components/CartDrawer.tsx";

function AppShell() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const { isOpen } = useCart();
  const { items, categories, loading, error } = useMenu(
    "https://raw.githubusercontent.com/roshan669/spiceUp-restro-app/refs/heads/main/src/data/items.json"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items && items.length ? items : fallbackMenu;
    return list.filter((item) => {
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false);
      const matchCategory = category === "All" || item.category === category;
      return matchQuery && matchCategory && (item.available ?? true);
    });
  }, [items, query, category]);

  return (
    <div className="app">
      <Header
        onCartClick={() => {
          /* handled in CartDrawer toggle */
        }}
      />
      <main className="container">
        <div className="controls">
          <SearchBar query={query} onChange={setQuery} />
          <CategoryFilter
            categories={[
              "All",
              ...(categories && categories.length
                ? categories
                : ["VEG ITEMS", "EGG ITEMS", "CHICKEN ITEMS"]),
            ]}
            value={category}
            onChange={setCategory}
          />
        </div>
        {loading ? (
          <p className="muted">Loading menu…</p>
        ) : error ? (
          <p className="muted">Failed to load remote menu. Showing defaults.</p>
        ) : null}
        <MenuGrid items={filtered} />
      </main>
      <CartDrawer open={isOpen} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}
