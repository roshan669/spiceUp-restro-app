import type { MenuItem } from "../data/menu";
import MenuItemCard from "./MenuItemCard";

export default function MenuGrid({ items }: { items: MenuItem[] }) {
  if (items.length === 0) {
    return <p className="muted">No items match your search.</p>;
  }
  return (
    <div className="grid">
      {items.map((it) => (
        <MenuItemCard key={it.id} item={it} />
      ))}
    </div>
  );
}
