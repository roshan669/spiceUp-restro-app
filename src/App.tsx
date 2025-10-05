import "./App.css";
import { useMemo, useState } from "react";
import CartProvider from "./context/CartProvider.tsx";
import { useCart } from "./context/cart.ts";
import { menu, categories } from "./data/menu.ts";
import Header from "./components/Header.tsx";
import SearchBar from "./components/SearchBar.tsx";
import CategoryFilter from "./components/CategoryFilter.tsx";
import MenuGrid from "./components/MenuGrid.tsx";
import CartDrawer from "./components/CartDrawer.tsx";

function AppShell() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const { isOpen } = useCart();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.filter((item) => {
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false);
      const matchCategory = category === "All" || item.category === category;
      return matchQuery && matchCategory && (item.available ?? true);
    });
  }, [query, category]);

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
            categories={["All", ...categories]}
            value={category}
            onChange={setCategory}
          />
        </div>
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
