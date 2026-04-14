const QuantitySelector = ({ value, onChange }) => (
  <div className="inline-flex items-center rounded-full bg-boutique-background p-1 text-boutique-maroon shadow-soft">
    <button
      type="button"
      onClick={() => onChange(Math.max(1, value - 1))}
      className="h-10 w-10 rounded-full transition hover:bg-white"
    >
      -
    </button>
    <span className="w-10 text-center text-sm font-semibold">{value}</span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="h-10 w-10 rounded-full transition hover:bg-white"
    >
      +
    </button>
  </div>
);

export default QuantitySelector;
