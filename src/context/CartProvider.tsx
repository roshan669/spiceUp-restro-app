import { useEffect, useMemo, useReducer, useState } from "react";
import type { MenuItem } from "../data/menu";
import { CartContext } from "./cart";

type CartLine = { id: string; name: string; price: number; qty: number };
type CartState = { lines: CartLine[] };
type Action =
  | { type: "add"; item: MenuItem }
  | { type: "inc"; id: string }
  | { type: "dec"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case "add": {
      const exists = state.lines.find((l) => l.id === action.item.id);
      if (exists) {
        return {
          lines: state.lines.map((l) =>
            l.id === exists.id ? { ...l, qty: l.qty + 1 } : l
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          {
            id: action.item.id,
            name: action.item.name,
            price: action.item.price,
            qty: 1,
          },
        ],
      };
    }
    case "inc":
      return {
        lines: state.lines.map((l) =>
          l.id === action.id ? { ...l, qty: l.qty + 1 } : l
        ),
      };
    case "dec":
      return {
        lines: state.lines.flatMap((l) =>
          l.id === action.id ? (l.qty > 1 ? { ...l, qty: l.qty - 1 } : []) : l
        ) as CartLine[],
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

export type CartContextValue = {
  state: CartState;
  add: (item: MenuItem) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const STORAGE_KEY = "spice-up-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CartState;
    } catch {
      // ignore read errors
    }
    return { lines: [] };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore write errors
    }
  }, [state]);

  const total = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    [state]
  );

  const value: CartContextValue = {
    state,
    add: (item) => dispatch({ type: "add", item }),
    inc: (id) => dispatch({ type: "inc", id }),
    dec: (id) => dispatch({ type: "dec", id }),
    remove: (id) => dispatch({ type: "remove", id }),
    clear: () => dispatch({ type: "clear" }),
    total,
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartProvider;
