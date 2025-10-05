import type { MenuItem } from "../data/menu";
import { useCart } from "../context/cart";
import { useRef } from "react";
import vegIcon from "../assets/veg.svg";
import nonvegIcon from "../assets/nonveg.svg";

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const imgRef = useRef<HTMLImageElement | null>(null);

  function handleAdd() {
    // Add to cart first for instant feedback
    add(item);

    // Fly-to-cart animation
    const source = imgRef.current;
    const target = document.getElementById("cart-target");
    if (!source || !target) return;

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const ghost = source.cloneNode(true) as HTMLImageElement;
    ghost.className = "fly-ghost";
    ghost.style.position = "fixed";
    ghost.style.left = `${sourceRect.left}px`;
    ghost.style.top = `${sourceRect.top}px`;
    ghost.style.width = `${sourceRect.width}px`;
    ghost.style.height = `${sourceRect.height}px`;
    ghost.style.zIndex = "999";
    document.body.appendChild(ghost);

    const translateX =
      targetRect.left +
      targetRect.width / 2 -
      (sourceRect.left + sourceRect.width / 2);
    const translateY =
      targetRect.top +
      targetRect.height / 2 -
      (sourceRect.top + sourceRect.height / 2);

    ghost.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        {
          transform: `translate(${translateX}px, ${translateY}px) scale(0.3)`,
          opacity: 0.2,
        },
      ],
      { duration: 500, easing: "cubic-bezier(.2,.7,.3,1)" }
    ).onfinish = () => {
      ghost.remove();
      // Optional: pulse the cart button
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.1)" },
          { transform: "scale(1)" },
        ],
        { duration: 250, easing: "ease-out" }
      );
    };
  }

  return (
    <div className="card item item-row">
      <div className="item-media">
        <img
          ref={imgRef}
          src={item.image || "/food-placeholder.svg"}
          onError={(e) => {
            const t = e.currentTarget;
            if (!t.dataset.fallback) {
              t.dataset.fallback = "1";
              t.src = "/food-placeholder.svg";
            }
          }}
          alt={item.name}
          loading="lazy"
        />
      </div>
      <div className="item-body">
        <div className="item-head">
          <div className="item-title">
            <span className="item-name">{item.name}</span>
            {item.spicy ? (
              <span className={`chip chip-spice-${item.spicy}`}>🌶</span>
            ) : null}
            <img
              src={item.veg ? vegIcon : nonvegIcon}
              alt={item.veg ? "Vegetarian" : "Non-Vegetarian"}
              className="diet-icon"
              width={16}
              height={16}
            />
          </div>
          <div className="item-price">₹{item.price}</div>
        </div>
        {item.description ? (
          <p className="item-desc">{item.description}</p>
        ) : null}
        <button
          className="btn add-btn"
          onClick={handleAdd}
          disabled={item.available === false}
        >
          Add
        </button>
      </div>
    </div>
  );
}
