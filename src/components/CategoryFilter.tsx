import vegIcon from "../assets/veg.svg";
import nonvegIcon from "../assets/nonveg.svg";

export default function CategoryFilter({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="segmented" role="tablist" aria-label="Filter by category">
      {categories.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active}
            className={`seg-button${active ? " active" : ""}`}
            onClick={() => onChange(c)}
          >
            {c}{" "}
            {c !== "All" && (
              <img
                src={c.includes("VEG") ? vegIcon : nonvegIcon}
                alt={c.includes("VEG") ? "Vegetarian" : "Non-Vegetarian"}
                className="diet-icon"
                width={16}
                height={16}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
