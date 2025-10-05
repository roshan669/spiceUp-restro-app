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
            {c}
          </button>
        );
      })}
    </div>
  );
}
