import { useCart } from "../context/cart";

export default function Header({ onCartClick }: { onCartClick?: () => void }) {
  const { state, open } = useCart();
  const count = state.lines.reduce((n, l) => n + l.qty, 0);
  return (
    <header className="header">
      <div className="container header-row">
        <div className="brand">
          <span className="brand-accent">Spice</span> Up
        </div>
        <button
          id="cart-target"
          className="cart-btn"
          onClick={() => {
            onCartClick?.();
            open();
          }}
        >
          Cart ({count})
        </button>
      </div>
    </header>
  );
}
