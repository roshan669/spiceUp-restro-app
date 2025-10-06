import { useCart } from "../context/cart";
import cart from "../assets/cart.svg";
import { useEffect, useRef } from "react";

export default function Header({ onCartClick }: { onCartClick?: () => void }) {
  const { state, open } = useCart();
  const count = state.lines.reduce((n, l) => n + l.qty, 0);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!btnRef.current) return;
    if (count <= 0) return;
    const el = btnRef.current;
    el.classList.remove("bump");
    // force reflow to restart animation
    void el.offsetWidth;
    el.classList.add("bump");
    const t = setTimeout(() => el.classList.remove("bump"), 300);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <header className="header">
      <div className="container header-row">
        <div className="brand">
          <span className="brand-accent">Spice</span> Up
        </div>

        <button
          id="cart-target"
          ref={btnRef}
          className="cart-btn"
          aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          onClick={() => {
            onCartClick?.();
            open();
          }}
        >
          <img src={cart} alt="" className="cart-icon" aria-hidden="true" />
          <span>Cart</span>
          {count > 0 ? (
            <span className="cart-badge" aria-hidden="true">
              {count}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
