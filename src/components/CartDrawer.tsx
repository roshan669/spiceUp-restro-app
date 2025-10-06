import { useCart } from "../context/cart";

export default function CartDrawer({ open }: { open: boolean }) {
  const { state, inc, dec, remove, clear, total, close } = useCart();
  return (
    <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
      <div className="drawer-header">
        <h3>Your Cart</h3>
        <button className="icon" onClick={close} aria-label="Close">
          ✕
        </button>
      </div>
      <div className="drawer-body">
        {state.lines.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <ul className="cart-list">
            {state.lines.map((l) => (
              <li key={l.id} className="cart-line">
                <div className="cart-line-main">
                  <div className="cart-line-name">{l.name}</div>
                  <div className="cart-line-price">₹{l.price}</div>
                </div>
                <div className="cart-line-actions">
                  <button
                    className="icon"
                    onClick={() => dec(l.id)}
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="qty">{l.qty}</span>
                  <button
                    className="icon"
                    onClick={() => inc(l.id)}
                    aria-label="Increase"
                  >
                    ＋
                  </button>
                  <button className="link" onClick={() => remove(l.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="drawer-foot">
        <div className="subtotal">
          Subtotal: <strong>₹{total}</strong>
        </div>
        <div className="actions">
          <button
            className="btn ghost"
            onClick={clear}
            disabled={state.lines.length === 0}
          >
            Clear
          </button>
          <button
            className="btn primary"
            onClick={() =>
              alert("Placing order feature will be available soon...")
            }
            disabled={state.lines.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </aside>
  );
}
