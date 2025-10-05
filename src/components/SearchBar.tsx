export default function SearchBar({
  query,
  onChange,
}: {
  query: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      aria-label="Search menu"
      className="input"
      placeholder="Search burgers, wraps, fries..."
      value={query}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
